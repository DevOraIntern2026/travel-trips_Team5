import '../../domain/entities/trip.dart';
import 'destination_model.dart';
import 'json_utils.dart';

class TripModel extends Trip {
  const TripModel({
    required super.id,
    required super.destinationId,
    required super.operatorId,
    required super.name,
    required super.description,
    required super.durationDays,
    required super.isActive,
    required super.cancellationWindowHours,
    required super.createdAt,
    required super.updatedAt,
    required super.destination,
  });

  factory TripModel.fromJson(JsonMap json) {
    final rawDestination = json['destination'];
    return TripModel(
      id: requiredInt(json, 'id'),
      destinationId: requiredInt(json, 'destinationId'),
      operatorId: nullableInt(json, 'operatorId'),
      name: requiredString(json, 'name'),
      description: nullableString(json, 'description'),
      durationDays: requiredInt(json, 'durationDays'),
      isActive: requiredBool(json, 'isActive'),
      cancellationWindowHours: requiredInt(json, 'cancellationWindowHours'),
      createdAt: requiredDateTime(json, 'createdAt'),
      updatedAt: requiredDateTime(json, 'updatedAt'),
      destination: rawDestination == null
          ? null
          : DestinationModel.fromJson(jsonMap(rawDestination)),
    );
  }
}
