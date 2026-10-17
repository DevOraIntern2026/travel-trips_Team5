import '../../domain/entities/destination.dart';
import 'json_utils.dart';

class DestinationModel extends Destination {
  const DestinationModel({
    required super.id,
    required super.name,
    required super.description,
    required super.city,
    required super.country,
    required super.isActive,
    required super.createdAt,
    required super.updatedAt,
  });

  factory DestinationModel.fromJson(JsonMap json) {
    return DestinationModel(
      id: requiredInt(json, 'id'),
      name: requiredString(json, 'name'),
      description: nullableString(json, 'description'),
      city: requiredString(json, 'city'),
      country: requiredString(json, 'country'),
      isActive: requiredBool(json, 'isActive'),
      createdAt: requiredDateTime(json, 'createdAt'),
      updatedAt: requiredDateTime(json, 'updatedAt'),
    );
  }
}
