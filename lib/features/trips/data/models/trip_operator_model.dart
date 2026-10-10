import '../../domain/entities/trip_operator.dart';
import 'json_utils.dart';

class TripOperatorModel extends TripOperator {
  const TripOperatorModel({
    required super.id,
    required super.name,
    required super.description,
    required super.isActive,
  });

  factory TripOperatorModel.fromJson(JsonMap json) {
    return TripOperatorModel(
      id: requiredInt(json, 'id'),
      name: requiredString(json, 'name'),
      description: nullableString(json, 'description'),
      isActive: requiredBool(json, 'isActive'),
    );
  }
}
