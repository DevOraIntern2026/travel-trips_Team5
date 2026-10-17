import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/trip_date_model.dart';
import '../../data/repo/booking_repo.dart';
import 'trip_dates_state.dart';

class TripDatesCubit extends Cubit<TripDatesState> {
  final BookingRepo _bookingRepo;

  TripDatesCubit(this._bookingRepo) : super(TripDatesInitial());

  Future<void> getTripDates(int tripId, {int page = 1, int limit = 10}) async {
    emit(TripDatesLoading());

    final ApiResult<List<TripDateModel>> result = await _bookingRepo
        .getTripDates(tripId, page: page, limit: limit);

    if (result is Success<List<TripDateModel>>) {
      emit(TripDatesSuccess(result.data));
    } else if (result is Failure<List<TripDateModel>>) {
      emit(TripDatesError(result.message));
    }
  }
}
