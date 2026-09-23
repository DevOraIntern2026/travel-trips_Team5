/// [BookingModel]
/// Represents the booking entity created by the user.
/// It holds the necessary data to be sent to the Backend API
/// when creating a new booking, and maps response data like status and ID.
class BookingModel {
  final String bookingId;
  final String tripId;
  final String dateId;
  final int seatsCount;
  final String status; // Pending, Confirmed
  final double totalPrice;
  BookingModel({
    required this.bookingId,
    required this.tripId,
    required this.dateId,
    required this.seatsCount,
    required this.status,
    required this.totalPrice,
  });
  Map<String, dynamic> toJson() {
    return {'trip_id': tripId, 'date_id': dateId, 'seats_count': seatsCount};
  }
}
