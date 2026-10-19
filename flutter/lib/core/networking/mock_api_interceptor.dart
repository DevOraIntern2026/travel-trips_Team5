import 'dart:math' as math;

import 'package:dio/dio.dart';

/// In-memory API used by the app while the backend is under development.
/// Requests still pass through the same repositories, data sources and use cases.
class MockApiInterceptor extends Interceptor {
  MockApiInterceptor() {
    seedBookings();
  }

  static const enabled = bool.fromEnvironment(
    'USE_MOCK_API',
    defaultValue: true,
  );

  final List<Map<String, dynamic>> _bookings = [];
  int _nextBookingId = 9001;
  int _nextUserId = 1001;
  Map<String, dynamic> _user = {
    'id': 1001,
    'name': 'TravelOra Guest',
    'email': 'traveler@example.com',
    'role': 'Customer',
    'operatorId': null,
    'emailVerified': true,
    'isActive': true,
  };

  static final _destinations = _buildDestinations();
  static final _trips = _buildTrips();
  static final _dates = _buildDates();

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (!enabled) {
      handler.next(options);
      return;
    }

    // Let loading and empty/error states be visible during manual flow testing.
    await Future<void>.delayed(const Duration(milliseconds: 220));
    try {
      final result = _dispatch(options);
      handler.resolve(
        Response<dynamic>(
          requestOptions: options,
          data: result.data,
          statusCode: result.statusCode,
        ),
      );
    } on _MockApiException catch (error) {
      final response = Response<dynamic>(
        requestOptions: options,
        data: {'message': error.message},
        statusCode: error.statusCode,
      );
      handler.reject(
        DioException.badResponse(
          statusCode: error.statusCode,
          requestOptions: options,
          response: response,
        ),
      );
    } on Object catch (error, stackTrace) {
      handler.reject(
        DioException(
          requestOptions: options,
          error: error,
          stackTrace: stackTrace,
          type: DioExceptionType.unknown,
        ),
      );
    }
  }

  _MockResponse _dispatch(RequestOptions request) {
    final path = request.uri.path
        .replaceFirst(RegExp(r'^/api/v\d+/?'), '')
        .replaceFirst(RegExp(r'^/+'), '')
        .replaceFirst(RegExp(r'/+$'), '');
    final method = request.method.toUpperCase();
    final query = request.queryParameters;

    if (method == 'POST' && path == 'auth/login') {
      final body = _body(request);
      final email = body['email']?.toString().trim() ?? '';
      final password = body['password']?.toString() ?? '';
      if (email.isEmpty || password.length < 6) {
        throw const _MockApiException(401, 'Invalid email or password.');
      }
      _user = {
        'id': _user['id'] ?? 1001,
        'name': _user['name'] ?? _nameFromEmail(email),
        'email': email,
        'role': 'Customer',
        'operatorId': null,
        'emailVerified': true,
        'isActive': true,
      };
      return _MockResponse(_authResponse(), statusCode: 200);
    }

    if (method == 'POST' && path == 'auth/register') {
      final body = _body(request);
      final name = body['name']?.toString().trim() ?? '';
      final email = body['email']?.toString().trim() ?? '';
      final password = body['password']?.toString() ?? '';
      if (name.isEmpty || email.isEmpty || password.length < 6) {
        throw const _MockApiException(
          400,
          'Enter a name, email and password of at least 6 characters.',
        );
      }
      _user = {
        'id': ++_nextUserId,
        'name': name,
        'email': email,
        'role': 'Customer',
        'operatorId': null,
        'emailVerified': false,
        'isActive': true,
      };
      return _MockResponse(_authResponse(), statusCode: 201);
    }

    if (method == 'GET' && path == 'users/me') {
      return _MockResponse({'data': Map<String, dynamic>.from(_user)});
    }

    if (method == 'PATCH' && path == 'users/me') {
      final body = _body(request);
      final name = body['name']?.toString().trim();
      final email = body['email']?.toString().trim();
      if (name != null && name.isNotEmpty) _user['name'] = name;
      if (email != null && email.contains('@')) _user['email'] = email;
      return _MockResponse({'data': Map<String, dynamic>.from(_user)});
    }

    if (method == 'GET' && path == 'destinations') {
      var items = List<Map<String, dynamic>>.from(_destinations);
      final search = query['search']?.toString().toLowerCase();
      if (search != null && search.isNotEmpty) {
        items = items
            .where(
              (item) => '${item['name']} ${item['city']} ${item['country']}'
                  .toLowerCase()
                  .contains(search),
            )
            .toList();
      }
      return _paginated(items, query);
    }

    if (method == 'GET' &&
        (path == 'trips' || path == 'trips/search' || path == 'trips/filter')) {
      var items = List<Map<String, dynamic>>.from(_trips);
      final search = (query['search'] ?? query['q'])
          ?.toString()
          .trim()
          .toLowerCase();
      if (search != null && search.isNotEmpty) {
        items = items
            .where(
              (trip) =>
                  '${trip['name']} ${trip['destination']['name']} ${trip['description']}'
                      .toLowerCase()
                      .contains(search),
            )
            .toList();
      }
      final destinationId = _int(query['destinationId']);
      if (destinationId != null) {
        items = items
            .where((trip) => trip['destinationId'] == destinationId)
            .toList();
      }
      final minPrice = _number(query['minPrice']);
      final maxPrice = _number(query['maxPrice']);
      final minDuration = _int(query['minDuration']);
      final maxDuration = _int(query['maxDuration']);
      if (minPrice != null) {
        items = items.where((trip) => trip['price'] >= minPrice).toList();
      }
      if (maxPrice != null) {
        items = items.where((trip) => trip['price'] <= maxPrice).toList();
      }
      if (minDuration != null) {
        items = items
            .where((trip) => trip['durationDays'] >= minDuration)
            .toList();
      }
      if (maxDuration != null) {
        items = items
            .where((trip) => trip['durationDays'] <= maxDuration)
            .toList();
      }
      if (query['availableOnly']?.toString() == 'true') {
        items = items
            .where((trip) => _datesFor(trip['id'] as int).any(_hasSeats))
            .toList();
      }
      if (path == 'trips/filter' && query['date'] != null) {
        final month = query['date'].toString().toLowerCase();
        items = items
            .where(
              (trip) => _datesFor(trip['id'] as int).any(
                (date) =>
                    date['startDate'].toString().toLowerCase().contains(month),
              ),
            )
            .toList();
      }
      if (query['sort']?.toString() == 'date_asc') {
        items.sort(
          (a, b) =>
              _firstDate(a['id'] as int).compareTo(_firstDate(b['id'] as int)),
        );
      }
      return _paginated(items, query);
    }

    final tripMatch = RegExp(r'^trips/(\d+)$').firstMatch(path);
    if (method == 'GET' && tripMatch != null) {
      return _MockResponse(_tripById(int.parse(tripMatch.group(1)!)));
    }

    final operatorMatch = RegExp(r'^trips/(\d+)/operator$').firstMatch(path);
    if (method == 'GET' && operatorMatch != null) {
      final tripId = int.parse(operatorMatch.group(1)!);
      _tripById(tripId);
      return _MockResponse({
        'id': 500 + tripId,
        'name': 'TravelOra Certified Guides',
        'description':
            'Small-group departures led by locally certified guides.',
        'isActive': true,
      });
    }

    final availabilityMatch = RegExp(
      r'^trips/(\d+)/dates/(\d+)/availability$',
    ).firstMatch(path);
    if (method == 'GET' && availabilityMatch != null) {
      final tripId = int.parse(availabilityMatch.group(1)!);
      final dateId = int.parse(availabilityMatch.group(2)!);
      final date = _dateById(tripId, dateId);
      final remaining = math.max(
        0,
        (date['capacity'] as int) - (date['bookedSeats'] as int),
      );
      return _MockResponse({
        'tripId': tripId,
        'dateId': dateId,
        'capacity': date['capacity'],
        'bookedSeats': date['bookedSeats'],
        'remainingSeats': remaining,
        'available': date['isActive'] == true && remaining > 0,
      });
    }

    final datesMatch = RegExp(r'^trips/(\d+)/dates$').firstMatch(path);
    if (method == 'GET' && datesMatch != null) {
      final tripId = int.parse(datesMatch.group(1)!);
      _tripById(tripId);
      return _paginated(_datesFor(tripId), query);
    }

    if (method == 'GET' && path == 'notifications') {
      return _MockResponse({'data': _notificationRecords()});
    }

    if (method == 'GET' && path == 'bookings') {
      return _MockResponse({
        'data': List<Map<String, dynamic>>.from(_bookings),
      });
    }

    if (method == 'POST' && path == 'bookings') {
      final dateId = _int(_body(request)['tripDateId']);
      if (dateId == null) {
        throw const _MockApiException(400, 'tripDateId is required.');
      }
      final dateAndTrip = _dateByGlobalId(dateId);
      final tripId = dateAndTrip['tripId'] as int;
      final date = dateAndTrip;
      if (!_hasSeats(date)) {
        throw const _MockApiException(409, 'This departure is full.');
      }
      date['bookedSeats'] = (date['bookedSeats'] as int) + 1;
      final booking = {
        'id': _nextBookingId++,
        'customerId': _int(_user['id']) ?? 1001,
        'tripId': tripId,
        'tripDateId': dateId,
        'price': date['price'],
        'status': 'Confirmed',
        'createdAt': DateTime.now().toUtc().toIso8601String(),
      };
      _bookings.insert(0, booking);
      return _MockResponse({'data': booking}, statusCode: 201);
    }

    final bookingStatusMatch = RegExp(
      r'^bookings/(\d+)/status$',
    ).firstMatch(path);
    if (method == 'GET' && bookingStatusMatch != null) {
      final booking = _bookingById(int.parse(bookingStatusMatch.group(1)!));
      return _MockResponse({
        'data': {'status': booking['status']},
      });
    }

    final bookingMatch = RegExp(r'^bookings/(\d+)$').firstMatch(path);
    if (method == 'GET' && bookingMatch != null) {
      return _MockResponse({
        'data': _bookingById(int.parse(bookingMatch.group(1)!)),
      });
    }
    final cancelMatch = RegExp(r'^bookings/(\d+)/cancel$').firstMatch(path);
    if (method == 'POST' && cancelMatch != null) {
      final booking = _bookingById(int.parse(cancelMatch.group(1)!));
      if (booking['status'] != 'Cancelled') {
        booking['status'] = 'Cancelled';
        final date = _dateByGlobalId(booking['tripDateId'] as int);
        date['bookedSeats'] = math.max(0, (date['bookedSeats'] as int) - 1);
      }
      return _MockResponse({'data': booking});
    }

    throw _MockApiException(404, 'Mock API endpoint not found: $method /$path');
  }

  Map<String, dynamic> _authResponse() => {
    'user': Map<String, dynamic>.from(_user),
    'accessToken': 'mock-access-${_user['id']}',
    'refreshToken': 'mock-refresh-${_user['id']}',
  };

  Map<String, dynamic> _body(RequestOptions request) {
    final body = request.data;
    if (body is Map<String, dynamic>) return body;
    if (body is Map) return Map<String, dynamic>.from(body);
    return <String, dynamic>{};
  }

  _MockResponse _paginated(
    List<Map<String, dynamic>> source,
    Map<String, dynamic> query,
  ) {
    final page = math.max(1, _int(query['page']) ?? 1).toInt();
    final limit = math.max(1, _int(query['limit']) ?? 10).toInt();
    final start = (page - 1) * limit;
    final end = math.min(start + limit, source.length).toInt();
    final data = start >= source.length
        ? <Map<String, dynamic>>[]
        : source.sublist(start, end);
    return _MockResponse({
      'data': data,
      'meta': {
        'page': page,
        'limit': limit,
        'total': source.length,
        'totalPages': math.max(1, (source.length / limit).ceil()).toInt(),
      },
    });
  }

  Map<String, dynamic> _tripById(int id) {
    for (final trip in _trips) {
      if (trip['id'] == id) return trip;
    }
    throw _MockApiException(404, 'Trip $id was not found.');
  }

  Map<String, dynamic> _dateById(int tripId, int dateId) {
    for (final date in _datesFor(tripId)) {
      if (date['id'] == dateId) return date;
    }
    throw _MockApiException(404, 'Departure $dateId was not found.');
  }

  Map<String, dynamic> _dateByGlobalId(int dateId) {
    for (final trip in _trips) {
      for (final date in _datesFor(trip['id'] as int)) {
        if (date['id'] == dateId) return date;
      }
    }
    throw _MockApiException(404, 'Departure $dateId was not found.');
  }

  List<Map<String, dynamic>> _notificationRecords() {
    final now = DateTime.now().toUtc();
    final records = <Map<String, dynamic>>[
      {
        'id': 'weather-dolomites',
        'type': 'alert',
        'tag': 'WEATHER UPDATE',
        'title': 'Clear conditions in the Dolomites',
        'body':
            'The latest trail outlook is clear with stable morning visibility for the next departure window.',
        'createdAt': now.subtract(const Duration(hours: 2)).toIso8601String(),
        'unread': true,
        'imageUrl': 'assets/imgs/Dolomites & Northern Italy.jpg',
        'imageCaption': 'Dolomites · latest conditions',
        'actionLabel': 'Explore Dolomites',
        'destinationId': 1,
      },
      {
        'id': 'prep-patagonia',
        'type': 'prep',
        'tag': 'TRIP PREPARATION',
        'title': 'Your Patagonia packing list is ready',
        'body':
            'Review the essentials for changing mountain weather, glacier walks and remote trail days.',
        'createdAt': now.subtract(const Duration(days: 1)).toIso8601String(),
        'unread': true,
        'imageUrl': 'assets/imgs/Patagonia & Los Glaciares.avif',
        'imageCaption': 'Patagonia & Los Glaciares',
        'actionLabel': 'View Patagonia trips',
        'destinationId': 2,
      },
      {
        'id': 'seat-kyoto',
        'type': 'seat',
        'tag': 'SEAT ALERT',
        'title': 'Seats are open for Kyoto & Kumano Kodo',
        'body':
            'A new departure has available seats. Check dates while the group is still small.',
        'createdAt': now.subtract(const Duration(days: 2)).toIso8601String(),
        'unread': false,
        'imageUrl': 'assets/imgs/Kyoto & Kumano Kodo.jpg',
        'imageCaption': 'Kyoto & Kumano Kodo',
        'actionLabel': 'View open departures',
        'destinationId': 5,
      },
    ];
    for (final booking in _bookings) {
      final tripId = booking['tripId'] as int;
      final trip = _trips.firstWhere((item) => item['id'] == tripId);
      final created = DateTime.tryParse(booking['createdAt'].toString()) ?? now;
      records.add({
        'id': 'booking-${booking['id']}',
        'type': 'booking',
        'tag': booking['status'].toString().toUpperCase(),
        'title': booking['status'] == 'Cancelled'
            ? 'Booking cancelled'
            : 'Trip booking confirmed',
        'body':
            '${trip['name']} · Reference #${booking['id']}. Open the booking to follow its details and departure information.',
        'createdAt': created.toIso8601String(),
        'unread': created.isAfter(now.subtract(const Duration(days: 3))),
        'imageUrl': trip['imageUrl'],
        'imageCaption': trip['name'],
        'actionLabel': 'Track booking',
        'bookingId': booking['id'],
      });
    }
    records.sort(
      (a, b) => b['createdAt'].toString().compareTo(a['createdAt'].toString()),
    );
    return records;
  }

  Map<String, dynamic> _bookingById(int id) {
    for (final booking in _bookings) {
      if (booking['id'] == id) return booking;
    }
    throw _MockApiException(404, 'Booking $id was not found.');
  }

  List<Map<String, dynamic>> _datesFor(int tripId) =>
      _dates.where((date) => date['tripId'] == tripId).toList();

  String _firstDate(int tripId) => _datesFor(tripId)
      .map((date) => date['startDate'] as String)
      .reduce((a, b) => a.compareTo(b) <= 0 ? a : b);

  bool _hasSeats(Map<String, dynamic> date) =>
      date['isActive'] == true &&
      (date['capacity'] as int) > (date['bookedSeats'] as int);

  int? _int(Object? value) =>
      value is num ? value.toInt() : int.tryParse('$value');
  double? _number(Object? value) =>
      value is num ? value.toDouble() : double.tryParse('$value');
  String _nameFromEmail(String email) {
    final prefix = email
        .split('@')
        .first
        .replaceAll(RegExp(r'[._-]+'), ' ')
        .trim();
    if (prefix.isEmpty) return 'Traveler';
    return prefix
        .split(' ')
        .map(
          (part) => part.isEmpty
              ? part
              : '${part[0].toUpperCase()}${part.substring(1)}',
        )
        .join(' ');
  }

  static List<Map<String, dynamic>> _buildDestinations() {
    const destinations = [
      (
        'Dolomites & Northern Italy',
        'Cortina d’Ampezzo',
        'Italy',
        'Limestone peaks, rifugios and high alpine passes.',
      ),
      (
        'Patagonia & Los Glaciares',
        'El Chaltén',
        'Argentina',
        'Glacier-fed lakes beneath the Fitz Roy massif.',
      ),
      (
        'Swiss & French Alps',
        'Zermatt',
        'Switzerland',
        'Classic high routes, glacier views and mountain villages.',
      ),
      (
        'Icelandic Highlands',
        'Landmannalaugar',
        'Iceland',
        'Geothermal valleys, lava fields and remote trails.',
      ),
      (
        'Japan Pilgrim Trails',
        'Kyoto',
        'Japan',
        'Ancient forest paths and centuries-old pilgrimage routes.',
      ),
      (
        'Amalfi Coast',
        'Amalfi',
        'Italy',
        'Coastal stairways, cliffside villages and Mediterranean views.',
      ),
      (
        'Bavarian Alps',
        'Garmisch-Partenkirchen',
        'Germany',
        'Alpine lakes, green meadows and limestone ridges.',
      ),
    ];
    final now = DateTime.now().toUtc().toIso8601String();
    return [
      for (var i = 0; i < destinations.length; i++)
        {
          'id': i + 1,
          'name': destinations[i].$1,
          'city': destinations[i].$2,
          'country': destinations[i].$3,
          'description': destinations[i].$4,
          'isActive': true,
          'createdAt': now,
          'updatedAt': now,
        },
    ];
  }

  static List<Map<String, dynamic>> _buildTrips() {
    const tripSpecs = [
      (
        1,
        'Dolomites Alta Via 1 High Route',
        'A classic hut-to-hut traverse across the limestone towers and high plateaus of the Dolomites.',
        6,
        1280.0,
        12,
        7,
        4.9,
      ),
      (
        2,
        'Patagonia Fitz Roy Glacier Trek',
        'A small-group trek to glacial lakes and the dramatic spires of the Fitz Roy range.',
        8,
        1450.0,
        10,
        8,
        4.9,
      ),
      (
        3,
        'Matterhorn Glacier Trail & Zermatt',
        'Glacier viewpoints and scenic high trails through the Swiss Alps.',
        5,
        1490.0,
        12,
        4,
        5.0,
      ),
      (
        4,
        'Iceland Highlands & Geysers',
        'Remote geothermal landscapes, colorful rhyolite hills and hot springs.',
        7,
        1650.0,
        10,
        6,
        4.8,
      ),
      (
        5,
        'Kyoto & Kumano Kodo Pilgrim Trail',
        'Walk forested pilgrimage routes connecting shrines, villages and mountain lodges.',
        9,
        1880.0,
        12,
        10,
        4.8,
      ),
      (
        6,
        'Amalfi Coast Cliffside Paths',
        'Follow historic footpaths above the Mediterranean through Amalfi villages.',
        5,
        920.0,
        10,
        3,
        4.7,
      ),
      (
        1,
        'Tre Cime & Brenta Massif Circuit',
        'Circle iconic limestone monoliths with overnight stays in alpine refuges.',
        4,
        940.0,
        12,
        5,
        4.8,
      ),
      (
        7,
        'Bavarian Alps Ridge & Lake Traverse',
        'A gentle ridge-and-lake journey through meadows and traditional mountain huts.',
        4,
        890.0,
        12,
        4,
        4.8,
      ),
      (
        3,
        'Tour du Mont Blanc Classic Circuit',
        'A guided circuit through France, Italy and Switzerland around the Mont Blanc massif.',
        8,
        1620.0,
        12,
        12,
        4.9,
      ),
      (
        4,
        'Laugavegur Trail Expedition',
        'A supported trek across black-sand deserts, glaciers and geothermal valleys.',
        6,
        1890.0,
        10,
        2,
        4.9,
      ),
    ];
    final now = DateTime.now().toUtc();
    return [
      for (var i = 0; i < tripSpecs.length; i++)
        {
          'id': i + 1,
          'destinationId': tripSpecs[i].$1,
          'operatorId': 501 + (i % 3),
          'name': tripSpecs[i].$2,
          'description': tripSpecs[i].$3,
          'durationDays': tripSpecs[i].$4,
          'isActive': true,
          'cancellationWindowHours': 720,
          'createdAt': now
              .subtract(const Duration(days: 180))
              .toIso8601String(),
          'updatedAt': now.toIso8601String(),
          'destination': _destinations.firstWhere(
            (d) => d['id'] == tripSpecs[i].$1,
          ),
          'price': tripSpecs[i].$5,
          'capacity': tripSpecs[i].$6,
          'bookedSeats': tripSpecs[i].$7,
          'rating': tripSpecs[i].$8,
          'category': i.isEven ? 'Trek & Traverse' : 'Expedition',
          'confirmed': true,
          'imageUrl': _imageForDestination(tripSpecs[i].$1),
        },
    ];
  }

  static String? _imageForDestination(int destinationId) =>
      switch (destinationId) {
        1 => 'assets/imgs/Dolomites & Northern Italy.jpg',
        2 => 'assets/imgs/Patagonia & Los Glaciares.avif',
        3 => 'assets/imgs/Swiss Alps & Matterhorn.webp',
        4 => 'assets/imgs/Icelandic Highlands & Geysers.webp',
        5 => 'assets/imgs/Kyoto & Kumano Kodo.jpg',
        6 => 'assets/imgs/Amalfi Coast.jpg',
        _ => null,
      };

  static List<Map<String, dynamic>> _buildDates() {
    final now = DateTime.now().toUtc();
    return [
      for (final trip in _trips)
        for (var departure = 0; departure < 3; departure++)
          () {
            final tripId = trip['id'] as int;
            final start = DateTime(
              now.year,
              now.month,
              now.day,
            ).add(Duration(days: 25 + departure * 75 + tripId * 4));
            final end = start.add(
              Duration(days: (trip['durationDays'] as int) - 1),
            );
            final tripBooked = trip['bookedSeats'] as int;
            final capacity = trip['capacity'] as int;
            return <String, dynamic>{
              'id': tripId * 100 + departure + 1,
              'tripId': tripId,
              'startDate': start.toIso8601String(),
              'endDate': end.toIso8601String(),
              'price': trip['price'],
              'capacity': capacity,
              'bookedSeats': math.min(capacity, tripBooked + (departure * 2)),
              'isActive': departure < 2,
              'createdAt': now
                  .subtract(const Duration(days: 90))
                  .toIso8601String(),
              'updatedAt': now.toIso8601String(),
            };
          }(),
    ];
  }

  static const _seedBookingId = 8001;
  void seedBookings() {
    if (_bookings.isNotEmpty) return;
    final date = _datesFor(1).first;
    _bookings.add({
      'id': _seedBookingId,
      'customerId': 1001,
      'tripId': 1,
      'tripDateId': date['id'],
      'price': date['price'],
      'status': 'Confirmed',
      'createdAt': DateTime.now()
          .toUtc()
          .subtract(const Duration(days: 2))
          .toIso8601String(),
    });
  }
}

class _MockResponse {
  const _MockResponse(this.data, {this.statusCode = 200});
  final Object? data;
  final int statusCode;
}

class _MockApiException implements Exception {
  const _MockApiException(this.statusCode, this.message);
  final int statusCode;
  final String message;
}
