import 'package:dio/dio.dart';
import 'package:fpdart/fpdart.dart';

import '../../domain/entities/paginated_result.dart';
import '../../domain/entities/destination.dart';
import '../../domain/entities/trip.dart';
import '../../domain/entities/trip_availability.dart';
import '../../domain/entities/trip_date.dart';
import '../../domain/entities/trip_operator.dart';
import '../../domain/failures/failure.dart';
import '../../domain/repositories/trips_repository.dart';
import '../datasources/trips_remote_data_source.dart';

class TripsRepositoryImpl implements TripsRepository {
  TripsRepositoryImpl(this._remoteDataSource);

  final TripsRemoteDataSource _remoteDataSource;

  @override
  Future<Either<Failure, PaginatedResult<Destination>>> getDestinations({
    String? search,
    int page = 1,
    int limit = 10,
  }) {
    return _run(
      () => _remoteDataSource.getDestinations(
        search: search,
        page: page,
        limit: limit,
      ),
    );
  }

  @override
  Future<Either<Failure, PaginatedResult<Trip>>> getTrips({
    int page = 1,
    int limit = 10,
    String? search,
    int? destinationId,
    int? operatorId,
    String? sort,
  }) {
    return _run(
      () => _remoteDataSource.getTrips(
        page: page,
        limit: limit,
        search: search,
        destinationId: destinationId,
        operatorId: operatorId,
        sort: sort,
      ),
    );
  }

  @override
  Future<Either<Failure, PaginatedResult<Trip>>> searchTrips({
    required String query,
    int page = 1,
    int limit = 10,
  }) {
    return _run(
      () => _remoteDataSource.searchTrips(
        query: query,
        page: page,
        limit: limit,
      ),
    );
  }

  @override
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
  }) {
    return _run(
      () => _remoteDataSource.filterTrips(
        destinationId: destinationId,
        date: date,
        minPrice: minPrice,
        maxPrice: maxPrice,
        minDuration: minDuration,
        maxDuration: maxDuration,
        availableOnly: availableOnly,
        page: page,
        limit: limit,
      ),
    );
  }

  @override
  Future<Either<Failure, Trip>> getTripDetails(int tripId) {
    return _run(() => _remoteDataSource.getTripDetails(tripId));
  }

  @override
  Future<Either<Failure, PaginatedResult<TripDate>>> getTripDates(
    int tripId, {
    int page = 1,
    int limit = 10,
  }) {
    return _run(
      () => _remoteDataSource.getTripDates(
        tripId,
        page: page,
        limit: limit,
      ),
    );
  }

  @override
  Future<Either<Failure, TripAvailability>> getTripAvailability(
    int tripId,
    int dateId,
  ) {
    return _run(() => _remoteDataSource.getTripAvailability(tripId, dateId));
  }

  @override
  Future<Either<Failure, TripOperator>> getTripOperator(int tripId) {
    return _run(() => _remoteDataSource.getTripOperator(tripId));
  }

  Future<Either<Failure, T>> _run<T>(Future<T> Function() request) async {
    try {
      return Right<Failure, T>(await request());
    } on DioException catch (error) {
      return Left<Failure, T>(_failureFromDio(error));
    } on FormatException catch (error) {
      return Left<Failure, T>(DataParsingFailure(error.message.toString()));
    } catch (_) {
      return const Left<Failure, Never>(UnexpectedFailure());
    }
  }

  Failure _failureFromDio(DioException error) {
    final statusCode = error.response?.statusCode;
    final message = _responseMessage(error.response?.data);

    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.connectionError) {
      return NetworkFailure(message ?? 'Unable to connect to the server.');
    }

    return switch (statusCode) {
      400 => ValidationFailure(message ?? 'The request was not valid.'),
      401 || 403 => AuthorizationFailure(
        message ?? 'The request is not authorized.',
      ),
      404 => NotFoundFailure(message ?? 'The requested item was not found.'),
      int code when code >= 500 => ServerFailure(
        message ?? 'The server could not complete the request.',
      ),
      _ => UnexpectedFailure(message ?? 'An unexpected error occurred.'),
    };
  }

  String? _responseMessage(Object? data) {
    if (data is! Map) return null;
    final message = data['message'];
    if (message is String) return message;
    if (message is List<Object?>) return message.whereType<String>().join('\n');
    return null;
  }
}
