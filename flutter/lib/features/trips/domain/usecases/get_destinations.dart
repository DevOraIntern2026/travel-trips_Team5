import 'package:fpdart/fpdart.dart';

import '../entities/destination.dart';
import '../entities/paginated_result.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class GetDestinations {
  const GetDestinations(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, PaginatedResult<Destination>>> call({
    String? search,
    int page = 1,
    int limit = 10,
  }) {
    return _repository.getDestinations(
      search: search,
      page: page,
      limit: limit,
    );
  }
}
