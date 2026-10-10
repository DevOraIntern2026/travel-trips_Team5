class TripAvailability {
  const TripAvailability({
    required this.tripId,
    required this.dateId,
    required this.capacity,
    required this.bookedSeats,
    required this.remainingSeats,
    required this.available,
  });

  final int tripId;
  final int dateId;
  final int capacity;
  final int bookedSeats;
  final int remainingSeats;
  final bool available;
}
