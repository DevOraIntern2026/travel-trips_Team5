import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/booking_model.dart';
import '../../data/models/trip_date_model.dart';
import '../../data/repo/booking_repo.dart';
import 'booking_details_state.dart';

class BookingDetailsCubit extends Cubit<BookingDetailsState> {
  final BookingRepo _bookingRepo;

  BookingDetailsCubit(this._bookingRepo) : super(BookingDetailsInitial());

  Future<void> getBookingDetails(int bookingId) async {
    emit(BookingDetailsLoading());

    final ApiResult<BookingModel> bookingResult = await _bookingRepo.getBooking(
      bookingId,
    );

    if (isClosed) return;

    if (bookingResult is Failure<BookingModel>) {
      emit(BookingDetailsError(bookingResult.message));
      return;
    }

    final booking = (bookingResult as Success<BookingModel>).data;

    // `GET /bookings/:id` already carries `status`, so no second
    // `GET /bookings/:id/status` round-trip is needed.

    // Best effort: dates of the booked departure.
    TripDateModel? tripDate;
    final datesResult = await _bookingRepo.getTripDates(
      booking.tripId,
      limit: 50,
    );
    if (datesResult is Success<List<TripDateModel>>) {
      for (final d in datesResult.data) {
        if (d.id == booking.tripDateId) tripDate = d;
      }
    }

    if (isClosed) return;
    emit(
      BookingDetailsSuccess(
        booking: booking,
        status: booking.status,
        tripDate: tripDate,
      ),
    );
  }
}
