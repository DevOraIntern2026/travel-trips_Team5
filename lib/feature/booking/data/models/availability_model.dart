class AvailabilityModel {
  final int tripId;
  final int dateId;
  final int capacity;
  final int bookedSeats;
  final int remainingSeats;
  final bool available;

  const AvailabilityModel({
    required this.tripId,
    required this.dateId,
    required this.capacity,
    required this.bookedSeats,
    required this.remainingSeats,
    required this.available,
  });

  factory AvailabilityModel.fromJson(Map<String, dynamic> json) {
    return AvailabilityModel(
      tripId: json['tripId'] as int,
      dateId: json['dateId'] as int,
      capacity: json['capacity'] as int,
      bookedSeats: json['bookedSeats'] as int,
      remainingSeats: json['remainingSeats'] as int,
      available: json['available'] as bool,
    );
  }
}
