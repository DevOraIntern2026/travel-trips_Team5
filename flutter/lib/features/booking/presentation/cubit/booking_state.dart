import '../../data/models/booking_model.dart';

abstract class BookingState {}

class BookingInitial extends BookingState {}

class BookingLoading extends BookingState {}

class BookingSuccess extends BookingState {
  final BookingModel booking;

  BookingSuccess(this.booking);
}

class BookingError extends BookingState {
  final String message;

  /// null => request never reached the server (offline / timeout).
  final int? statusCode;

  BookingError(this.message, {this.statusCode});

  bool get isNetworkError => statusCode == null;
  bool get isSeatCollision => statusCode == 409;
}
