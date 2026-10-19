class TripDate {
  const TripDate({
    required this.id,
    required this.tripId,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.capacity,
    required this.bookedSeats,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  final int id;
  final int tripId;
  final DateTime startDate;
  final DateTime endDate;
  final double price;
  final int capacity;
  final int bookedSeats;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
}
