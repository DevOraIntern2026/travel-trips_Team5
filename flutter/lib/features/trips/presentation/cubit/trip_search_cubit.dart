import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/entities/trip.dart';
import '../../domain/failures/failure.dart';
import '../../domain/usecases/search_trips.dart';
import 'trip_request_status.dart';

class TripSearchState {
  const TripSearchState({
    this.status = TripRequestStatus.initial,
    this.query = '',
    this.trips = const [],
    this.page = 1,
    this.limit = 10,
    this.total = 0,
    this.totalPages = 0,
    this.failure,
  });

  final TripRequestStatus status;
  final String query;
  final List<Trip> trips;
  final int page;
  final int limit;
  final int total;
  final int totalPages;
  final Failure? failure;
}

class TripSearchCubit extends Cubit<TripSearchState> {
  TripSearchCubit(this._searchTrips) : super(const TripSearchState());

  final SearchTrips _searchTrips;
  Timer? _debounce;
  int _requestId = 0;

  Future<void> search(String rawQuery, {int page = 1, int limit = 10}) async {
    final query = rawQuery.trim();
    final requestId = ++_requestId;
    _debounce?.cancel();

    if (query.isEmpty) {
      emit(const TripSearchState());
      return;
    }

    emit(TripSearchState(
      status: TripRequestStatus.loading,
      query: query,
      page: page,
      limit: limit,
    ));

    _debounce = Timer(const Duration(milliseconds: 300), () {
      unawaited(
        _runSearch(
          query,
          page: page,
          limit: limit,
          requestId: requestId,
        ),
      );
    });
  }

  Future<void> _runSearch(
    String query, {
    required int page,
    required int limit,
    required int requestId,
  }) async {
    final result = await _searchTrips(query: query, page: page, limit: limit);
    if (isClosed || requestId != _requestId) return;

    result.match(
      (failure) => emit(TripSearchState(
        status: TripRequestStatus.failure,
        query: query,
        trips: state.trips,
        page: page,
        limit: limit,
        total: state.total,
        totalPages: state.totalPages,
        failure: failure,
      )),
      (result) => emit(TripSearchState(
        status: result.data.isEmpty
            ? TripRequestStatus.empty
            : TripRequestStatus.success,
        query: query,
        trips: result.data,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      )),
    );
  }

  @override
  Future<void> close() {
    _debounce?.cancel();
    return super.close();
  }
}
