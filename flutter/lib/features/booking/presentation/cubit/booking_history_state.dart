import '../../data/models/booking_model.dart';
import '../../data/models/trip_date_model.dart';

abstract class BookingHistoryState {}

class BookingHistoryInitial extends BookingHistoryState {}

class BookingHistoryLoading extends BookingHistoryState {}

class BookingHistorySuccess extends BookingHistoryState {
  final List<BookingModel> bookings;

  /// tripDateId -> date info (best effort; may be missing).
  final Map<int, TripDateModel> tripDates;

  BookingHistorySuccess(this.bookings, {this.tripDates = const {}});
}

class BookingHistoryError extends BookingHistoryState {
  final String message;

  BookingHistoryError(this.message);
}
