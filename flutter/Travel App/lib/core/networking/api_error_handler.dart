import 'package:dio/dio.dart';

import 'api_error_model.dart';

class ApiErrorHandler {
  const ApiErrorHandler._();

  static ApiErrorModel handle(Object error) {
    if (error is! DioException) {
      return const ApiErrorModel(message: 'An unexpected error occurred.');
    }

    final statusCode = error.response?.statusCode;

    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.transformTimeout:
        return ApiErrorModel(
          statusCode: statusCode,
          message: 'Connection timed out. Please try again.',
        );

      case DioExceptionType.connectionError:
        return ApiErrorModel(
          statusCode: statusCode,
          message: 'No internet connection. Please check your network.',
        );

      case DioExceptionType.badCertificate:
        return ApiErrorModel(
          statusCode: statusCode,
          message: 'Security certificate error.',
        );

      case DioExceptionType.badResponse:
        return _handleBadResponse(error.response, statusCode);

      case DioExceptionType.cancel:
        return ApiErrorModel(
          statusCode: statusCode,
          message: 'Request was cancelled.',
        );

      case DioExceptionType.unknown:
        return ApiErrorModel(
          statusCode: statusCode,
          message: 'Something went wrong. Please try again.',
        );
    }
  }

  static ApiErrorModel _handleBadResponse(
    Response<dynamic>? response,
    int? statusCode,
  ) {
    final data = response?.data;

    if (data is Map<String, dynamic>) {
      return ApiErrorModel.fromJson(data, statusCode: statusCode);
    }

    return ApiErrorModel(
      statusCode: statusCode,
      message: 'Something went wrong. Please try again.',
    );
  }
}
