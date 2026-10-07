import '../../data/models/booking_model.dart';

abstract class BookingDetailsState {}

class BookingDetailsInitial extends BookingDetailsState {}

class BookingDetailsLoading extends BookingDetailsState {}

class BookingDetailsSuccess extends BookingDetailsState {
  final BookingModel booking;
  final String status;

  BookingDetailsSuccess({required this.booking, required this.status});
}

class BookingDetailsError extends BookingDetailsState {
  final String message;

  BookingDetailsError(this.message);
}
