import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/booking_model.dart';
import '../../data/models/trip_date_model.dart';
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

    if (isClosed) return;

    if (result is Failure<List<BookingModel>>) {
      emit(BookingHistoryError(result.message));
      return;
    }

    final bookings = (result as Success<List<BookingModel>>).data;

    // Best effort: fetch the departures of every trip so each card can show
    // real dates. A failure here never breaks the list.
    final dates = <int, TripDateModel>{};
    await Future.wait(
      bookings.map((b) => b.tripId).toSet().map((tripId) async {
        final r = await _bookingRepo.getTripDates(tripId, limit: 50);
        if (r is Success<List<TripDateModel>>) {
          for (final d in r.data) {
            dates[d.id] = d;
          }
        }
      }),
    );

    if (isClosed) return;
    emit(BookingHistorySuccess(bookings, tripDates: dates));
  }
}
