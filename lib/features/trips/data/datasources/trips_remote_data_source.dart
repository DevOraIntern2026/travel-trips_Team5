import 'package:dio/dio.dart';

import '../models/json_utils.dart';
import '../models/paginated_response_model.dart';
import '../models/destination_model.dart';
import '../models/trip_availability_model.dart';
import '../models/trip_date_model.dart';
import '../models/trip_model.dart';
import '../models/trip_operator_model.dart';

/// Makes HTTP requests for the Trips feature.
///
/// The source parses response JSON into data models and lets Dio exceptions
/// propagate so the repository can translate transport failures into domain
/// failures.
class TripsRemoteDataSource {
  TripsRemoteDataSource(this._dio);

  final Dio _dio;

  Future<PaginatedResponseModel<DestinationModel>> getDestinations({
    String? search,
    int page = 1,
    int limit = 10,
  }) {
    return _getPaginated(
      'destinations',
      DestinationModel.fromJson,
      queryParameters: {
        if (search != null && search.trim().isNotEmpty) 'search': search.trim(),
        'page': page,
        'limit': limit,
      },
    );
  }

  Future<PaginatedResponseModel<TripModel>> getTrips({
    int page = 1,
    int limit = 10,
    String? search,
    int? destinationId,
    int? operatorId,
    String? sort,
  }) {
    return _getPaginated(
      'trips',
      TripModel.fromJson,
      queryParameters: {
        'page': page,
        'limit': limit,
        if (search != null) 'search': search,
        if (destinationId != null) 'destinationId': destinationId,
        if (operatorId != null) 'operatorId': operatorId,
        if (sort != null) 'sort': sort,
      },
    );
  }

  Future<PaginatedResponseModel<TripModel>> searchTrips({
    required String query,
    int page = 1,
    int limit = 10,
  }) {
    return _getPaginated(
      'trips/search',
      TripModel.fromJson,
      queryParameters: {'q': query, 'page': page, 'limit': limit},
    );
  }

  Future<PaginatedResponseModel<TripModel>> filterTrips({
    int? destinationId,
    String? date,
    num? minPrice,
    num? maxPrice,
    int? minDuration,
    int? maxDuration,
    bool? availableOnly,
    int page = 1,
    int limit = 10,
  }) {
    return _getPaginated(
      'trips/filter',
      TripModel.fromJson,
      queryParameters: {
        if (destinationId != null) 'destinationId': destinationId,
        if (date != null) 'date': date,
        if (minPrice != null) 'minPrice': minPrice,
        if (maxPrice != null) 'maxPrice': maxPrice,
        if (minDuration != null) 'minDuration': minDuration,
        if (maxDuration != null) 'maxDuration': maxDuration,
        if (availableOnly != null) 'availableOnly': availableOnly,
        'page': page,
        'limit': limit,
      },
    );
  }

  Future<TripModel> getTripDetails(int tripId) async {
    return TripModel.fromJson(await _get('trips/$tripId'));
  }

  Future<PaginatedResponseModel<TripDateModel>> getTripDates(
    int tripId, {
    int page = 1,
    int limit = 10,
  }) {
    return _getPaginated(
      'trips/$tripId/dates',
      TripDateModel.fromJson,
      queryParameters: {'page': page, 'limit': limit},
    );
  }

  Future<TripAvailabilityModel> getTripAvailability(
    int tripId,
    int dateId,
  ) async {
    return TripAvailabilityModel.fromJson(
      await _get('trips/$tripId/dates/$dateId/availability'),
    );
  }

  Future<TripOperatorModel> getTripOperator(int tripId) async {
    return TripOperatorModel.fromJson(await _get('trips/$tripId/operator'));
  }

  Future<PaginatedResponseModel<T>> _getPaginated<T>(
    String path,
    T Function(JsonMap) parseItem, {
    Map<String, Object?>? queryParameters,
  }) async {
    final response = await _get(path, queryParameters: queryParameters);
    return PaginatedResponseModel<T>.fromJson(response, parseItem);
  }

  Future<Map<String, Object?>> _get(
    String path, {
    Map<String, Object?>? queryParameters,
  }) async {
    final response = await _dio.get<Object?>(
      path,
      queryParameters: queryParameters,
    );
    final data = response.data;
    return jsonMap(data);
  }
}
