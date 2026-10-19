class Destination {
  const Destination({
    required this.id,
    required this.name,
    required this.description,
    required this.city,
    required this.country,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  final int id;
  final String name;
  final String? description;
  final String city;
  final String country;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
}
