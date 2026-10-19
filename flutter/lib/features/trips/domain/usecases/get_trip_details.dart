import 'package:fpdart/fpdart.dart';

import '../entities/trip.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class GetTripDetails {
  const GetTripDetails(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, Trip>> call(int tripId) {
    return _repository.getTripDetails(tripId);
  }
}
