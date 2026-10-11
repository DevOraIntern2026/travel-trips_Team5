import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/trip_model.dart';
import '../../data/repo/trips_repo.dart';
import 'home_state.dart';

class HomeCubit extends Cubit<HomeState> {
  final TripsRepo _tripsRepo;

  HomeCubit(this._tripsRepo) : super(HomeInitial());

  Future<void> getTrips() async {
    emit(HomeLoading());

    final ApiResult<List<TripModel>> result = await _tripsRepo.getTrips();

    if (isClosed) return;

    if (result is Success<List<TripModel>>) {
      emit(HomeSuccess(result.data));
    } else if (result is Failure<List<TripModel>>) {
      emit(HomeError(result.message));
    }
  }

  Future<void> searchTrips(String query) async {
    emit(HomeLoading());
    final result = await _tripsRepo.searchTrips(query);
    if (isClosed) return;

    switch (result) {
      case Success<List<TripModel>>(:final data):
        emit(HomeSuccess(data));
      case Failure<List<TripModel>>(:final message):
        emit(HomeError(message));
    }
  }

  Future<void> filterTrips({
    double? minPrice,
    double? maxPrice,
    bool? availableOnly,
  }) async {
    emit(HomeLoading());
    final result = await _tripsRepo.filterTrips(
      minPrice: minPrice,
      maxPrice: maxPrice,
      availableOnly: availableOnly,
    );
    if (isClosed) return;

    switch (result) {
      case Success<List<TripModel>>(:final data):
        emit(HomeSuccess(data));
      case Failure<List<TripModel>>(:final message):
        emit(HomeError(message));
    }
  }
}
