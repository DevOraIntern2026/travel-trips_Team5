import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/booking_model.dart';
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

    if (bookingResult is Error<BookingModel>) {
      emit(BookingDetailsError(bookingResult.message));
      return;
    }

    final booking = (bookingResult as Success<BookingModel>).data;

    final ApiResult<String> statusResult = await _bookingRepo.getBookingStatus(
      bookingId,
    );

    if (statusResult is Error<String>) {
      emit(BookingDetailsError(statusResult.message));
      return;
    }

    final status = (statusResult as Success<String>).data;

    emit(BookingDetailsSuccess(booking: booking, status: status));
  }
}
