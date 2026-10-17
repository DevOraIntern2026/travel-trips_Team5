import 'destination.dart';

class Trip {
  const Trip({
    required this.id,
    required this.destinationId,
    required this.operatorId,
    required this.name,
    required this.description,
    required this.durationDays,
    required this.isActive,
    required this.cancellationWindowHours,
    required this.createdAt,
    required this.updatedAt,
    required this.destination,
  });

  final int id;
  final int destinationId;
  final int? operatorId;
  final String name;
  final String? description;
  final int durationDays;
  final bool isActive;
  final int cancellationWindowHours;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Destination? destination;
}
