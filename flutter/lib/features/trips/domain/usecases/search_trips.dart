import 'package:fpdart/fpdart.dart';

import '../entities/paginated_result.dart';
import '../entities/trip.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class SearchTrips {
  const SearchTrips(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, PaginatedResult<Trip>>> call({
    required String query,
    int page = 1,
    int limit = 10,
  }) {
    return _repository.searchTrips(query: query, page: page, limit: limit);
  }
}
