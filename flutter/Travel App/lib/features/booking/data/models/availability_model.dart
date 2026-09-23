/// [AvailabilityModel]
/// Represents the trip date and seat availability data.
/// This model maps the JSON response received from the Backend API
/// to check how many seats are left before the user proceeds to book.
class AvailabilityModel {
  final String dateId;
  final String tripId;
  final String date;
  final int totalSeats;
  final int availableSeats;
  AvailabilityModel({
    required this.dateId,
    required this.tripId,
    required this.date,
    required this.totalSeats,
    required this.availableSeats,
  });
  factory AvailabilityModel.fromJson(Map<String, dynamic> json) {
    return AvailabilityModel(
      dateId: json['date_id'] ?? '',
      tripId: json['trip_id'] ?? '',
      date: json['date'] ?? '',
      totalSeats: json['total_seats'] ?? 0,
      availableSeats: json['available_seats'] ?? 0,
    );
  }
}
