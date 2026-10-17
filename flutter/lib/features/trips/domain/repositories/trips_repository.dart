import 'package:fpdart/fpdart.dart';

import '../entities/paginated_result.dart';
import '../entities/destination.dart';
import '../entities/trip.dart';
import '../entities/trip_availability.dart';
import '../entities/trip_date.dart';
import '../entities/trip_operator.dart';
import '../failures/failure.dart';

abstract interface class TripsRepository {
  Future<Either<Failure, PaginatedResult<Destination>>> getDestinations({
    String? search,
    int page = 1,
    int limit = 10,
  });

  Future<Either<Failure, PaginatedResult<Trip>>> getTrips({
    int page = 1,
    int limit = 10,
    String? search,
    int? destinationId,
    int? operatorId,
    String? sort,
  });

  Future<Either<Failure, PaginatedResult<Trip>>> searchTrips({
    required String query,
    int page = 1,
    int limit = 10,
  });

  Future<Either<Failure, PaginatedResult<Trip>>> filterTrips({
    int? destinationId,
    String? date,
    num? minPrice,
    num? maxPrice,
    int? minDuration,
    int? maxDuration,
    bool? availableOnly,
    int page = 1,
    int limit = 10,
  });

  Future<Either<Failure, Trip>> getTripDetails(int tripId);

  Future<Either<Failure, PaginatedResult<TripDate>>> getTripDates(
    int tripId, {
    int page = 1,
    int limit = 10,
  });

  Future<Either<Failure, TripAvailability>> getTripAvailability(
    int tripId,
    int dateId,
  );

  Future<Either<Failure, TripOperator>> getTripOperator(int tripId);
}
