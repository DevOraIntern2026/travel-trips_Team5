class TripDateModel {
  final int id;
  final int tripId;
  final String startDate;
  final String endDate;
  final double price;
  final int capacity;
  final bool isActive;

  const TripDateModel({
    required this.id,
    required this.tripId,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.capacity,
    required this.isActive,
  });

  factory TripDateModel.fromJson(Map<String, dynamic> json) {
    return TripDateModel(
      id: json['id'] as int,
      tripId: json['tripId'] as int,
      startDate: json['startDate'] as String,
      endDate: json['endDate'] as String,
      price: (json['price'] as num).toDouble(),
      capacity: json['capacity'] as int,
      isActive: json['isActive'] as bool,
    );
  }
}
