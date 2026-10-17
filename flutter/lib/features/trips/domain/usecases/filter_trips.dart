import 'package:fpdart/fpdart.dart';

import '../entities/paginated_result.dart';
import '../entities/trip.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class FilterTrips {
  const FilterTrips(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, PaginatedResult<Trip>>> call({
    int? destinationId,
    String? date,
    num? minPrice,
    num? maxPrice,
    int? minDuration,
    int? maxDuration,
    bool? availableOnly,
    int page = 1,
    int limit = 10,
  }) {
    return _repository.filterTrips(
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
  }
}
