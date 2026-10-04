import 'package:devora_trips/feature/booking/data/models/availability_model.dart';
import 'package:devora_trips/feature/booking/data/models/booking_model.dart';
import 'package:devora_trips/feature/booking/data/models/create_booking_request_model.dart';
import 'package:devora_trips/feature/booking/data/models/trip-date_model.dart';
import 'package:dio/dio.dart';

import '../../../../core/networking/api_constants.dart';
import '../../../../core/networking/api_error_handler.dart';
import '../../../../core/networking/api_result.dart';

class BookingRepo {
  final Dio _dio;

  BookingRepo(this._dio);

  Future<ApiResult<List<TripDateModel>>> getTripDates(
    int tripId, {
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.tripDates(tripId),
        queryParameters: {'page': page, 'limit': limit},
      );

      final responseData = response.data as Map<String, dynamic>;

      final datesData = responseData['data'];

      if (datesData is! List) {
        return const Error('Invalid trip dates response.');
      }

      final tripDates = datesData
          .map((item) => TripDateModel.fromJson(item as Map<String, dynamic>))
          .toList();

      return Success(tripDates);
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Error(apiError.message, statusCode: apiError.statusCode);
    }
  }

  Future<ApiResult<AvailabilityModel>> getAvailability(
    int tripId,
    int dateId,
  ) async {
    try {
      final response = await _dio.get(
        ApiConstants.tripDateAvailability(tripId, dateId),
      );

      final availability = AvailabilityModel.fromJson(
        response.data as Map<String, dynamic>,
      );

      return Success(availability);
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Error(apiError.message, statusCode: apiError.statusCode);
    }
  }

  Future<ApiResult<BookingModel>> createBooking(
    CreateBookingRequestModel request,
  ) async {
    try {
      final response = await _dio.post(
        ApiConstants.bookings,
        data: request.toJson(),
      );

      final responseData = response.data as Map<String, dynamic>;

      final booking = BookingModel.fromJson(
        responseData['data'] as Map<String, dynamic>,
      );

      return Success(booking);
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Error(apiError.message, statusCode: apiError.statusCode);
    }
  }

  Future<ApiResult<List<BookingModel>>> getBookings({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.bookings,
        queryParameters: {'page': page, 'limit': limit},
      );

      final responseData = response.data as Map<String, dynamic>;

      final bookingsData = responseData['data'];

      if (bookingsData is! List) {
        return const Error('Invalid bookings response.');
      }

      final bookings = bookingsData
          .map((item) => BookingModel.fromJson(item as Map<String, dynamic>))
          .toList();

      return Success(bookings);
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Error(apiError.message, statusCode: apiError.statusCode);
    }
  }

  Future<ApiResult<BookingModel>> getBooking(int bookingId) async {
    try {
      final response = await _dio.get(ApiConstants.bookingDetails(bookingId));

      final responseData = response.data as Map<String, dynamic>;

      final booking = BookingModel.fromJson(
        responseData['data'] as Map<String, dynamic>,
      );

      return Success(booking);
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Error(apiError.message, statusCode: apiError.statusCode);
    }
  }

  Future<ApiResult<String>> getBookingStatus(int bookingId) async {
    try {
      final response = await _dio.get(ApiConstants.bookingStatus(bookingId));

      final responseData = response.data as Map<String, dynamic>;

      final statusData = responseData['data'] as Map<String, dynamic>;

      return Success(statusData['status'].toString());
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Error(apiError.message, statusCode: apiError.statusCode);
    }
  }

  Future<ApiResult<BookingModel>> cancelBooking(int bookingId) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.bookings}/$bookingId/cancel',
      );

      final responseData = response.data as Map<String, dynamic>;

      final booking = BookingModel.fromJson(
        responseData['data'] as Map<String, dynamic>,
      );

      return Success(booking);
    } catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Error(apiError.message, statusCode: apiError.statusCode);
    }
  }
}
