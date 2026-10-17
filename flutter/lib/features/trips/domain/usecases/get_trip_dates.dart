import 'package:fpdart/fpdart.dart';

import '../entities/paginated_result.dart';
import '../entities/trip_date.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class GetTripDates {
  const GetTripDates(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, PaginatedResult<TripDate>>> call(
    int tripId, {
    int page = 1,
    int limit = 10,
  }) {
    return _repository.getTripDates(tripId, page: page, limit: limit);
  }
}
