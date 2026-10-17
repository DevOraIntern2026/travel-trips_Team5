import '../../domain/entities/trip_date.dart';
import 'json_utils.dart';

class TripDateModel extends TripDate {
  const TripDateModel({
    required super.id,
    required super.tripId,
    required super.startDate,
    required super.endDate,
    required super.price,
    required super.capacity,
    required super.bookedSeats,
    required super.isActive,
    required super.createdAt,
    required super.updatedAt,
  });

  factory TripDateModel.fromJson(JsonMap json) {
    return TripDateModel(
      id: requiredInt(json, 'id'),
      tripId: requiredInt(json, 'tripId'),
      startDate: requiredDateTime(json, 'startDate'),
      endDate: requiredDateTime(json, 'endDate'),
      price: requiredDouble(json, 'price'),
      capacity: requiredInt(json, 'capacity'),
      bookedSeats: requiredInt(json, 'bookedSeats'),
      isActive: requiredBool(json, 'isActive'),
      createdAt: requiredDateTime(json, 'createdAt'),
      updatedAt: requiredDateTime(json, 'updatedAt'),
    );
  }
}
