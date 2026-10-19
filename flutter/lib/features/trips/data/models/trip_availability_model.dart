import '../../domain/entities/trip_availability.dart';
import 'json_utils.dart';

class TripAvailabilityModel extends TripAvailability {
  const TripAvailabilityModel({
    required super.tripId,
    required super.dateId,
    required super.capacity,
    required super.bookedSeats,
    required super.remainingSeats,
    required super.available,
  });

  factory TripAvailabilityModel.fromJson(JsonMap json) {
    return TripAvailabilityModel(
      tripId: requiredInt(json, 'tripId'),
      dateId: requiredInt(json, 'dateId'),
      capacity: requiredInt(json, 'capacity'),
      bookedSeats: requiredInt(json, 'bookedSeats'),
      remainingSeats: requiredInt(json, 'remainingSeats'),
      available: requiredBool(json, 'available'),
    );
  }
}
