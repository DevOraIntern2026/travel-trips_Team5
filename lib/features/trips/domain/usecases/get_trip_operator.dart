import 'package:fpdart/fpdart.dart';

import '../entities/trip_operator.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class GetTripOperator {
  const GetTripOperator(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, TripOperator>> call(int tripId) {
    return _repository.getTripOperator(tripId);
  }
}
