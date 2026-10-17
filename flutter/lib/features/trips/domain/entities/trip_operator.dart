class TripOperator {
  const TripOperator({
    required this.id,
    required this.name,
    required this.description,
    required this.isActive,
  });

  final int id;
  final String name;
  final String? description;
  final bool isActive;
}
