import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/booking_model.dart';
import '../../data/repo/booking_repo.dart';
import 'booking_history_state.dart';

class BookingHistoryCubit extends Cubit<BookingHistoryState> {
  final BookingRepo _bookingRepo;

  BookingHistoryCubit(this._bookingRepo) : super(BookingHistoryInitial());

  Future<void> getBookings({int page = 1, int limit = 10}) async {
    emit(BookingHistoryLoading());

    final ApiResult<List<BookingModel>> result = await _bookingRepo.getBookings(
      page: page,
      limit: limit,
    );

    if (result is Success<List<BookingModel>>) {
      emit(BookingHistorySuccess(result.data));
    } else if (result is Error<List<BookingModel>>) {
      emit(BookingHistoryError(result.message));
    }
  }
}
