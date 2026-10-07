import '../../data/models/booking_model.dart';

abstract class BookingHistoryState {}

class BookingHistoryInitial extends BookingHistoryState {}

class BookingHistoryLoading extends BookingHistoryState {}

class BookingHistorySuccess extends BookingHistoryState {
  final List<BookingModel> bookings;

  BookingHistorySuccess(this.bookings);
}

class BookingHistoryError extends BookingHistoryState {
  final String message;

  BookingHistoryError(this.message);
}
