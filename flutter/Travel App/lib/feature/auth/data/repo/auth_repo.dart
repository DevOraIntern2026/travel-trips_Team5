import 'package:dio/dio.dart';
import 'package:devora_trips/core/storage/token_storage.dart';

import '../../../../core/networking/api_constants.dart';
import '../../../../core/networking/api_error_handler.dart';
import '../../../../core/networking/api_result.dart';
import '../models/auth_response_model.dart';
import '../models/login_request_model.dart';
import '../models/register_request_model.dart';

class AuthRepo {
  final Dio _dio;
  final TokenStorage _tokenStorage;

  AuthRepo(this._dio, this._tokenStorage);

  /// `POST /auth/login` -> 200, `POST /auth/register` -> 201.
  /// Both return the same flat `{ user, accessToken, refreshToken }` body.
  Future<ApiResult<AuthResponseModel>> login(LoginRequestModel request) {
    return _authenticate(ApiConstants.login, request.toJson());
  }

  Future<ApiResult<AuthResponseModel>> register(RegisterRequestModel request) {
    return _authenticate(ApiConstants.register, request.toJson());
  }

  Future<ApiResult<AuthResponseModel>> _authenticate(
    String path,
    Map<String, dynamic> body,
  ) async {
    try {
      final response = await _dio.post(path, data: body);

      final session = AuthResponseModel.fromJson(
        Map<String, dynamic>.from(response.data as Map),
      );

      // Persist before returning so every later protected call is authorised.
      await _tokenStorage.saveSession(
        token: session.accessToken,
        refreshToken: session.refreshToken,
        user: session.user,
      );

      return Success<AuthResponseModel>(session);
    } on DioException catch (error) {
      final apiError = ApiErrorHandler.handle(error);

      return Failure<AuthResponseModel>(
        apiError.message,
        statusCode: apiError.statusCode,
      );
    } on Object {
      // A malformed payload must not surface as a raw crash to the user.
      return const Failure<AuthResponseModel>(
        'We could not read the server response. Please try again.',
      );
    }
  }
}
