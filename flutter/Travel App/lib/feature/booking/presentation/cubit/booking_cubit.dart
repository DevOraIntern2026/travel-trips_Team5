import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/booking_model.dart';
import '../../data/models/create_booking_request_model.dart';
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

    if (isClosed) return;

    if (result is Success<BookingModel>) {
      emit(BookingSuccess(result.data));
    } else if (result is Failure<BookingModel>) {
      emit(BookingError(result.message, statusCode: result.statusCode));
    }
  }

  /// Back to the review form (e.g. after an error banner was dismissed).
  void reset() => emit(BookingInitial());
}
