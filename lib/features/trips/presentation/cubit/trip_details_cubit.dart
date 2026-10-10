import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/entities/paginated_result.dart';
import '../../domain/entities/trip.dart';
import '../../domain/entities/trip_availability.dart';
import '../../domain/entities/trip_date.dart';
import '../../domain/entities/trip_operator.dart';
import '../../domain/failures/failure.dart';
import '../../domain/usecases/get_trip_availability.dart';
import '../../domain/usecases/get_trip_dates.dart';
import '../../domain/usecases/get_trip_details.dart';
import '../../domain/usecases/get_trip_operator.dart';
import 'trip_request_status.dart';

class TripDetailsState {
  const TripDetailsState({
    this.tripStatus = TripRequestStatus.initial,
    this.trip,
    this.tripFailure,
    this.operatorStatus = TripRequestStatus.initial,
    this.tripOperator,
    this.operatorFailure,
    this.datesStatus = TripRequestStatus.initial,
    this.dates,
    this.datesFailure,
    this.availabilityStatus = TripRequestStatus.initial,
    this.availability,
    this.availabilityFailure,
    this.selectedDateId,
  });

  final TripRequestStatus tripStatus;
  final Trip? trip;
  final Failure? tripFailure;
  final TripRequestStatus operatorStatus;
  final TripOperator? tripOperator;
  final Failure? operatorFailure;
  final TripRequestStatus datesStatus;
  final PaginatedResult<TripDate>? dates;
  final Failure? datesFailure;
  final TripRequestStatus availabilityStatus;
  final TripAvailability? availability;
  final Failure? availabilityFailure;
  final int? selectedDateId;

  TripDetailsState copyWith({
    TripRequestStatus? tripStatus,
    Trip? trip,
    Failure? tripFailure,
    TripRequestStatus? operatorStatus,
    TripOperator? tripOperator,
    Failure? operatorFailure,
    TripRequestStatus? datesStatus,
    PaginatedResult<TripDate>? dates,
    Failure? datesFailure,
    TripRequestStatus? availabilityStatus,
    TripAvailability? availability,
    Failure? availabilityFailure,
    int? selectedDateId,
    bool clearTrip = false,
    bool clearTripFailure = false,
    bool clearTripOperator = false,
    bool clearOperatorFailure = false,
    bool clearDates = false,
    bool clearDatesFailure = false,
    bool clearAvailability = false,
    bool clearAvailabilityFailure = false,
    bool clearSelectedDate = false,
  }) {
    return TripDetailsState(
      tripStatus: tripStatus ?? this.tripStatus,
      trip: clearTrip ? null : trip ?? this.trip,
      tripFailure: clearTripFailure ? null : tripFailure ?? this.tripFailure,
      operatorStatus: operatorStatus ?? this.operatorStatus,
      tripOperator:
          clearTripOperator ? null : tripOperator ?? this.tripOperator,
      operatorFailure: clearOperatorFailure
          ? null
          : operatorFailure ?? this.operatorFailure,
      datesStatus: datesStatus ?? this.datesStatus,
      dates: clearDates ? null : dates ?? this.dates,
      datesFailure: clearDatesFailure ? null : datesFailure ?? this.datesFailure,
      availabilityStatus: availabilityStatus ?? this.availabilityStatus,
      availability: clearAvailability ? null : availability ?? this.availability,
      availabilityFailure: clearAvailabilityFailure
          ? null
          : availabilityFailure ?? this.availabilityFailure,
      selectedDateId:
          clearSelectedDate ? null : selectedDateId ?? this.selectedDateId,
    );
  }
}

class TripDetailsCubit extends Cubit<TripDetailsState> {
  TripDetailsCubit({
    required GetTripDetails getTripDetails,
    required GetTripDates getTripDates,
    required GetTripAvailability getTripAvailability,
    required GetTripOperator getTripOperator,
  }) : _getTripDetails = getTripDetails,
       _getTripDates = getTripDates,
       _getTripAvailability = getTripAvailability,
       _getTripOperator = getTripOperator,
       super(const TripDetailsState());

  final GetTripDetails _getTripDetails;
  final GetTripDates _getTripDates;
  final GetTripAvailability _getTripAvailability;
  final GetTripOperator _getTripOperator;
  int _tripRequestId = 0;
  int _availabilityRequestId = 0;

  Future<void> loadTrip(int tripId) async {
    final requestId = ++_tripRequestId;
    ++_availabilityRequestId;
    emit(const TripDetailsState(
      tripStatus: TripRequestStatus.loading,
      datesStatus: TripRequestStatus.loading,
    ));

    final tripResult = await _getTripDetails(tripId);
    if (isClosed || requestId != _tripRequestId) return;

    final trip = tripResult.match<Trip?>(
      (failure) {
        emit(state.copyWith(
          tripStatus: TripRequestStatus.failure,
          tripFailure: failure,
          datesStatus: TripRequestStatus.failure,
          datesFailure: failure,
        ));
        return null;
      },
      (trip) {
        emit(state.copyWith(
          tripStatus: TripRequestStatus.success,
          trip: trip,
          operatorStatus: trip.operatorId == null
              ? TripRequestStatus.initial
              : TripRequestStatus.loading,
          clearTripFailure: true,
          clearTripOperator: true,
          clearOperatorFailure: true,
        ));
        return trip;
      },
    );
    if (trip == null) return;

    final datesFuture = _getTripDates(tripId);
    final operatorFuture = trip.operatorId == null
        ? null
        : _getTripOperator(tripId);

    final datesResult = await datesFuture;
    if (isClosed || requestId != _tripRequestId) return;

    datesResult.match(
      (failure) => emit(state.copyWith(
        datesStatus: TripRequestStatus.failure,
        datesFailure: failure,
      )),
      (dates) => emit(state.copyWith(
        datesStatus: dates.data.isEmpty
            ? TripRequestStatus.empty
            : TripRequestStatus.success,
        dates: dates,
        clearDatesFailure: true,
      )),
    );

    if (operatorFuture == null) return;
    final operatorResult = await operatorFuture;
    if (isClosed || requestId != _tripRequestId) return;

    operatorResult.match(
      (failure) => emit(state.copyWith(
        operatorStatus: TripRequestStatus.failure,
        operatorFailure: failure,
      )),
      (tripOperator) => emit(state.copyWith(
        operatorStatus: TripRequestStatus.success,
        tripOperator: tripOperator,
        clearOperatorFailure: true,
      )),
    );
  }

  Future<void> loadTripDates(int tripId, {int page = 1, int limit = 10}) async {
    final requestId = ++_tripRequestId;
    emit(state.copyWith(
      datesStatus: TripRequestStatus.loading,
      clearDatesFailure: true,
    ));

    final result = await _getTripDates(tripId, page: page, limit: limit);
    if (isClosed || requestId != _tripRequestId) return;

    result.match(
      (failure) => emit(state.copyWith(
        datesStatus: TripRequestStatus.failure,
        datesFailure: failure,
      )),
      (dates) => emit(state.copyWith(
        datesStatus: dates.data.isEmpty
            ? TripRequestStatus.empty
            : TripRequestStatus.success,
        dates: dates,
        clearDatesFailure: true,
      )),
    );
  }

  Future<void> selectTripDate(int tripId, int dateId) async {
    final requestId = ++_availabilityRequestId;
    emit(state.copyWith(
      availabilityStatus: TripRequestStatus.loading,
      selectedDateId: dateId,
      clearAvailability: true,
      clearAvailabilityFailure: true,
    ));

    final result = await _getTripAvailability(tripId, dateId);
    if (isClosed || requestId != _availabilityRequestId) return;

    result.match(
      (failure) => emit(state.copyWith(
        availabilityStatus: TripRequestStatus.failure,
        availabilityFailure: failure,
      )),
      (availability) => emit(state.copyWith(
        availabilityStatus: TripRequestStatus.success,
        availability: availability,
        clearAvailabilityFailure: true,
      )),
    );
  }
}
