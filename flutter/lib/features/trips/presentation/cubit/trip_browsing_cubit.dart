import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/entities/paginated_result.dart';
import '../../domain/entities/trip.dart';
import '../../domain/failures/failure.dart';
import '../../domain/usecases/filter_trips.dart';
import '../../domain/usecases/get_trips.dart';
import 'trip_request_status.dart';

class TripFilterCriteria {
  const TripFilterCriteria({
    this.destinationId,
    this.destinationLabel,
    this.date,
    this.dateLabel,
    this.minPrice,
    this.maxPrice,
    this.minDuration,
    this.maxDuration,
    this.availableOnly,
    this.hideSoldOut,
  });

  final int? destinationId;
  final String? destinationLabel;
  final String? date;
  final String? dateLabel;
  final num? minPrice;
  final num? maxPrice;
  final int? minDuration;
  final int? maxDuration;
  final bool? availableOnly;
  final bool? hideSoldOut;

  int get visibleCount {
    return [
      destinationId,
      date,
      minPrice,
      maxPrice,
      availableOnly == true ? true : null,
    ].where((value) => value != null).length;
  }

  List<String> get chipLabels {
    return [
      if (destinationLabel != null) destinationLabel!,
      if (dateLabel != null) dateLabel!,
      if (minPrice != null || maxPrice != null)
        'Under ${maxPrice == null ? 'any' : '\$${maxPrice!.round()}'}',
    ];
  }
}

class TripBrowsingState {
  const TripBrowsingState({
    this.status = TripRequestStatus.initial,
    this.trips = const [],
    this.page = 1,
    this.limit = 10,
    this.total = 0,
    this.totalPages = 0,
    this.failure,
    this.sort,
    this.filters,
  });

  final TripRequestStatus status;
  final List<Trip> trips;
  final int page;
  final int limit;
  final int total;
  final int totalPages;
  final Failure? failure;
  final String? sort;
  final TripFilterCriteria? filters;

  TripBrowsingState copyWith({
    TripRequestStatus? status,
    List<Trip>? trips,
    int? page,
    int? limit,
    int? total,
    int? totalPages,
    Failure? failure,
    String? sort,
    TripFilterCriteria? filters,
    bool clearFailure = false,
    bool clearSort = false,
    bool clearFilters = false,
  }) {
    return TripBrowsingState(
      status: status ?? this.status,
      trips: trips ?? this.trips,
      page: page ?? this.page,
      limit: limit ?? this.limit,
      total: total ?? this.total,
      totalPages: totalPages ?? this.totalPages,
      failure: clearFailure ? null : failure ?? this.failure,
      sort: clearSort ? null : sort ?? this.sort,
      filters: clearFilters ? null : filters ?? this.filters,
    );
  }
}

class TripBrowsingCubit extends Cubit<TripBrowsingState> {
  TripBrowsingCubit({
    required GetTrips getTrips,
    required FilterTrips filterTrips,
  })
    : _getTrips = getTrips,
      _filterTrips = filterTrips,
      super(const TripBrowsingState());

  final GetTrips _getTrips;
  final FilterTrips _filterTrips;
  int _requestId = 0;

  Future<void> loadTrips({
    int page = 1,
    int limit = 10,
    String? search,
    int? destinationId,
    int? operatorId,
    String? sort,
  }) async {
    final requestId = ++_requestId;
    emit(state.copyWith(
      status: TripRequestStatus.loading,
      page: page,
      limit: limit,
      clearFailure: true,
      sort: sort,
      clearSort: sort == null,
      clearFilters: true,
    ));

    final result = await _getTrips(
      page: page,
      limit: limit,
      search: search,
      destinationId: destinationId,
      operatorId: operatorId,
      sort: sort,
    );
    if (isClosed || requestId != _requestId) return;

    result.match(
      (failure) => emit(state.copyWith(
        status: TripRequestStatus.failure,
        failure: failure,
      )),
      (pageResult) => emit(_successState(pageResult, sort: sort)),
    );
  }

  Future<void> applyFilters({
    int? destinationId,
    String? destinationLabel,
    String? date,
    String? dateLabel,
    num? minPrice,
    num? maxPrice,
    int? minDuration,
    int? maxDuration,
    bool? availableOnly,
    bool? hideSoldOut,
    int page = 1,
    int limit = 10,
  }) async {
    final filters = TripFilterCriteria(
      destinationId: destinationId,
      destinationLabel: destinationLabel,
      date: date,
      dateLabel: dateLabel,
      minPrice: minPrice,
      maxPrice: maxPrice,
      minDuration: minDuration,
      maxDuration: maxDuration,
      availableOnly: availableOnly,
      hideSoldOut: hideSoldOut,
    );
    final requestId = ++_requestId;
    emit(state.copyWith(
      status: TripRequestStatus.loading,
      page: page,
      limit: limit,
      clearFailure: true,
      clearSort: true,
      filters: filters,
    ));

    final result = await _filterTrips(
      destinationId: destinationId,
      date: date,
      minPrice: minPrice,
      maxPrice: maxPrice,
      minDuration: minDuration,
      maxDuration: maxDuration,
      availableOnly: availableOnly,
      page: page,
      limit: limit,
    );
    if (isClosed || requestId != _requestId) return;

    result.match(
      (failure) => emit(state.copyWith(
        status: TripRequestStatus.failure,
        failure: failure,
      )),
      (pageResult) => emit(_successState(pageResult)),
    );
  }

  TripBrowsingState _successState(
    PaginatedResult<Trip> result, {
    String? sort,
  }) {
    return state.copyWith(
      status: result.data.isEmpty
          ? TripRequestStatus.empty
          : TripRequestStatus.success,
      trips: result.data,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
      clearFailure: true,
      sort: sort,
      clearSort: sort == null,
    );
  }
}
