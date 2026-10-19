import 'package:fpdart/fpdart.dart';

import '../entities/paginated_result.dart';
import '../entities/trip.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class GetTrips {
  const GetTrips(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, PaginatedResult<Trip>>> call({
    int page = 1,
    int limit = 10,
    String? search,
    int? destinationId,
    int? operatorId,
    String? sort,
  }) {
    return _repository.getTrips(
      page: page,
      limit: limit,
      search: search,
      destinationId: destinationId,
      operatorId: operatorId,
      sort: sort,
    );
  }
}
