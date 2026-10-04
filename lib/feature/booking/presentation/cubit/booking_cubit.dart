import 'package:devora_trips/feature/booking/data/models/booking_model.dart';
import 'package:devora_trips/feature/booking/data/models/create_booking_request_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/repo/booking_repo.dart';
import 'booking_state.dart';

class BookingCubit extends Cubit<BookingState> {
  final BookingRepo _bookingRepo;

  BookingCubit(this._bookingRepo) : super(BookingInitial());

  Future<void> createBooking(int tripDateId) async {
    emit(BookingLoading());

    final request = CreateBookingRequestModel(tripDateId: tripDateId);

    final ApiResult<BookingModel> result = await _bookingRepo.createBooking(
      request,
    );

    if (result is Success<BookingModel>) {
      emit(BookingSuccess(result.data));
    } else if (result is Error<BookingModel>) {
      emit(BookingError(result.message));
    }
  }

  Future<void> cancelBooking(int bookingId) async {
    emit(BookingLoading());

    final ApiResult<BookingModel> result = await _bookingRepo.cancelBooking(
      bookingId,
    );

    if (result is Success<BookingModel>) {
      emit(BookingSuccess(result.data));
    } else if (result is Error<BookingModel>) {
      emit(BookingError(result.message));
    }
  }
}
