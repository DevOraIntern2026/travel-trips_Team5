import 'package:fpdart/fpdart.dart';

import '../entities/trip_availability.dart';
import '../failures/failure.dart';
import '../repositories/trips_repository.dart';

class GetTripAvailability {
  const GetTripAvailability(this._repository);

  final TripsRepository _repository;

  Future<Either<Failure, TripAvailability>> call(int tripId, int dateId) {
    return _repository.getTripAvailability(tripId, dateId);
  }
}
