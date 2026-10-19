import 'package:dio/dio.dart';

import '../../../../core/networking/api_constants.dart';
import '../../../../core/networking/api_error_handler.dart';
import '../../../../core/networking/api_result.dart';
import '../models/trip_model.dart';

class TripsRepo {
  final Dio _dio;

  TripsRepo(this._dio);

  Future<ApiResult<List<TripModel>>> getTrips({
    int page = 1,
    int limit = 50,
  }) async {
    return _fetch(ApiConstants.trips, {'page': page, 'limit': limit});
  }

  Future<ApiResult<List<TripModel>>> searchTrips(
    String query, {
    int page = 1,
    int limit = 50,
  }) {
    return _fetch(ApiConstants.tripSearch, {
      'q': query,
      'page': page,
      'limit': limit,
    });
  }

  Future<ApiResult<List<TripModel>>> filterTrips({
    double? minPrice,
    double? maxPrice,
    bool? availableOnly,
    int page = 1,
    int limit = 50,
  }) {
    return _fetch(ApiConstants.tripFilter, {
      'minPrice': ?minPrice,
      'maxPrice': ?maxPrice,
      if (availableOnly == true) 'availableOnly': true,
      'page': page,
      'limit': limit,
    });
  }

  Future<ApiResult<List<TripModel>>> _fetch(
    String path,
    Map<String, dynamic> queryParameters,
  ) async {
    try {
      final response = await _dio.get(path, queryParameters: queryParameters);

      final body = response.data;
      final data = body is Map ? body['data'] : body;

      if (data is! List) {
        return const Failure<List<TripModel>>('Invalid trips response.');
      }

      final trips = data
          .map((e) => TripModel.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();

      return Success(trips);
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);
      return Failure(apiError.message, statusCode: apiError.statusCode);
    }
  }
}
