import '../../data/models/booking_model.dart';
import '../../data/models/trip_date_model.dart';

abstract class BookingDetailsState {}

class BookingDetailsInitial extends BookingDetailsState {}

class BookingDetailsLoading extends BookingDetailsState {}

class BookingDetailsSuccess extends BookingDetailsState {
  final BookingModel booking;
  final String status;
  final TripDateModel? tripDate;

  BookingDetailsSuccess({
    required this.booking,
    required this.status,
    this.tripDate,
  });
}

class BookingDetailsError extends BookingDetailsState {
  final String message;

  BookingDetailsError(this.message);
}
