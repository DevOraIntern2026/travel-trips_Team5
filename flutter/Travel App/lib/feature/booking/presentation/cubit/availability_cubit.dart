import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/availability_model.dart';
import '../../data/repo/booking_repo.dart';
import 'availability_state.dart';

class AvailabilityCubit extends Cubit<AvailabilityState> {
  final BookingRepo _bookingRepo;

  AvailabilityCubit(this._bookingRepo) : super(AvailabilityInitial());

  Future<void> getAvailability(int tripId, int dateId) async {
    emit(AvailabilityLoading());

    final ApiResult<AvailabilityModel> result = await _bookingRepo
        .getAvailability(tripId, dateId);

    if (result is Success<AvailabilityModel>) {
      emit(AvailabilitySuccess(result.data));
    } else if (result is Error<AvailabilityModel>) {
      emit(AvailabilityError(result.message));
    }
  }
}
