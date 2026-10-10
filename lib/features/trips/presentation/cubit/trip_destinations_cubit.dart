import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/entities/destination.dart';
import '../../domain/failures/failure.dart';
import '../../domain/usecases/get_destinations.dart';
import 'trip_request_status.dart';

class TripDestinationsState {
  const TripDestinationsState({
    this.status = TripRequestStatus.initial,
    this.destinations = const [],
    this.query = '',
    this.failure,
  });

  final TripRequestStatus status;
  final List<Destination> destinations;
  final String query;
  final Failure? failure;
}

class TripDestinationsCubit extends Cubit<TripDestinationsState> {
  TripDestinationsCubit(this._getDestinations)
    : super(const TripDestinationsState());

  final GetDestinations _getDestinations;
  Timer? _debounce;
  int _requestId = 0;

  void search(String rawQuery) {
    final query = rawQuery.trim();
    final requestId = ++_requestId;
    _debounce?.cancel();
    emit(TripDestinationsState(
      status: TripRequestStatus.loading,
      query: query,
    ));
    _debounce = Timer(const Duration(milliseconds: 250), () {
      unawaited(_load(query, requestId));
    });
  }

  Future<void> load() async {
    final requestId = ++_requestId;
    _debounce?.cancel();
    emit(const TripDestinationsState(status: TripRequestStatus.loading));
    await _load('', requestId);
  }

  Future<void> _load(String query, int requestId) async {
    final result = await _getDestinations(
      search: query.isEmpty ? null : query,
      page: 1,
      limit: 50,
    );
    if (isClosed || requestId != _requestId) return;

    result.match(
      (failure) => emit(TripDestinationsState(
        status: TripRequestStatus.failure,
        query: query,
        failure: failure,
      )),
      (page) => emit(TripDestinationsState(
        status: page.data.isEmpty
            ? TripRequestStatus.empty
            : TripRequestStatus.success,
        destinations: page.data,
        query: query,
      )),
    );
  }

  @override
  Future<void> close() {
    _debounce?.cancel();
    return super.close();
  }
}
