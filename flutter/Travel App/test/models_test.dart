import 'package:devora_trips/feature/auth/data/models/auth_response_model.dart';
import 'package:devora_trips/feature/auth/data/models/user_model.dart';
import 'package:devora_trips/feature/booking/data/models/availability_model.dart';
import 'package:devora_trips/feature/booking/data/models/booking_model.dart';
import 'package:devora_trips/feature/booking/data/models/trip_date_model.dart';
import 'package:flutter_test/flutter_test.dart';

/// Payloads below were captured from the running backend
/// (http://localhost:3000/api/v1) and cross-checked against the NestJS
/// controllers/DTOs in backend/src.
void main() {
  group('UserModel', () {
    test('parses the register payload (numeric id, Customer role)', () {
      final user = UserModel.fromJson({
        'id': 2,
        'email': 'sara@example.com',
        'name': 'Sara',
        'role': 'Customer',
        'operatorId': null,
        'emailVerified': true,
        'isActive': true,
      });

      expect(user.id, '2');
      expect(user.email, 'sara@example.com');
      expect(user.name, 'Sara');
      expect(user.role, 'Customer');
      expect(user.operatorId, isNull);
    });

    test('accepts a null name (backend returns null when not supplied)', () {
      final user = UserModel.fromJson({
        'id': 7,
        'email': 'noname@example.com',
        'name': null,
        'role': 'Customer',
      });

      expect(user.name, isNull);
      expect(user.id, '7');
    });

    test('keeps the role verbatim without mapping it to an enum', () {
      final admin = UserModel.fromJson({'id': 1, 'role': 'Admin'});
      final operator = UserModel.fromJson({
        'id': 3,
        'role': 'Operator',
        'operatorId': 9,
      });

      expect(admin.role, 'Admin');
      expect(operator.role, 'Operator');
      expect(operator.operatorId, 9);
    });

    test('round-trips through toJson', () {
      final user = UserModel.fromJson({
        'id': 4,
        'email': 'a@b.co',
        'role': 'Customer',
      });
      final restored = UserModel.fromJson(user.toJson());

      expect(restored.id, '4');
      expect(restored.email, 'a@b.co');
    });
  });

  group('AuthResponseModel', () {
    test('parses the flat register/login session body', () {
      final session = AuthResponseModel.fromJson({
        'user': {
          'id': 2,
          'email': 'sara@example.com',
          'name': 'Sara',
          'role': 'Customer',
          'operatorId': null,
          'emailVerified': true,
          'isActive': true,
        },
        'accessToken': 'access-token-value',
        'refreshToken': 'refresh-token-value',
      });

      expect(session.accessToken, 'access-token-value');
      expect(session.refreshToken, 'refresh-token-value');
      expect(session.user.role, 'Customer');
    });

    test('does not throw when optional user fields are missing', () {
      final session = AuthResponseModel.fromJson({'accessToken': 'only-token'});

      expect(session.accessToken, 'only-token');
      expect(session.user.role, '');
      expect(session.user.name, isNull);
    });
  });

  group('BookingModel', () {
    test('parses the { success, data } envelope and decimal-string price', () {
      final body = {
        'success': true,
        'message': 'Booking created successfully',
        'data': {
          'id': 101,
          'customerId': 2,
          'tripId': 5,
          'tripDateId': 42,
          'price': '299.99',
          'status': 'Confirmed',
          'createdAt': '2026-10-15T10:30:00Z',
          'updatedAt': '2026-10-15T10:30:00Z',
        },
      };

      final booking = BookingModel.fromJson(
        body['data'] as Map<String, dynamic>,
      );

      expect(booking.id, 101);
      expect(booking.price, 299.99);
      expect(booking.status, 'Confirmed');
      expect(booking.createdAt.isUtc, isTrue);
    });

    test('accepts a numeric price too', () {
      final booking = BookingModel.fromJson({
        'id': 1,
        'customerId': 1,
        'tripId': 1,
        'tripDateId': 1,
        'price': 1288,
        'status': 'Cancelled',
        'createdAt': '2026-01-01T00:00:00Z',
      });

      expect(booking.price, 1288.0);
      expect(booking.status, 'Cancelled');
    });
  });

  group('TripDateModel', () {
    test('parses the trip-dates payload where price is a JSON number', () {
      final date = TripDateModel.fromJson({
        'id': 42,
        'tripId': 5,
        'startDate': '2026-05-18',
        'endDate': '2026-05-23',
        'price': 1288,
        'capacity': 12,
        'bookedSeats': 4,
        'isActive': true,
      });

      expect(date.id, 42);
      expect(date.price, 1288.0);
      expect(date.capacity, 12);
    });
  });

  group('AvailabilityModel', () {
    test('parses the flat availability payload', () {
      final availability = AvailabilityModel.fromJson({
        'tripId': 5,
        'dateId': 42,
        'capacity': 12,
        'bookedSeats': 4,
        'remainingSeats': 8,
        'available': true,
      });

      expect(availability.remainingSeats, 8);
      expect(availability.available, isTrue);
    });
  });
}
