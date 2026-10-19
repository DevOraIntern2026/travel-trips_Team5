import 'package:dio/dio.dart';

import 'api_constants.dart';
import '../storage/token_storage.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._tokenStorage, this._client, String baseUrl)
    : _refreshClient = Dio(BaseOptions(baseUrl: baseUrl));

  final TokenStorage _tokenStorage;
  final Dio _client;
  final Dio _refreshClient;

  static const Set<String> _authPaths = {
    'auth/login',
    'auth/register',
    ApiConstants.refresh,
    'auth/logout',
  };
  static const String _retriedKey = 'retriedAfterRefresh';

  Future<String?>? _refreshInFlight;

  bool _isAuthPath(String path) => _authPaths.any(path.endsWith);

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (!_isAuthPath(options.path)) {
      final token = await _tokenStorage.getToken();

      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }

    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final request = err.requestOptions;
    if (err.response?.statusCode != 401 ||
        request.extra[_retriedKey] == true ||
        _isAuthPath(request.path)) {
      handler.next(err);
      return;
    }

    try {
      final currentToken = await _tokenStorage.getToken();
      final requestToken = request.headers['Authorization']
          ?.toString()
          .replaceFirst('Bearer ', '');

      // Another request may already have rotated the token while this one
      // was in flight. Reuse that token instead of rotating twice.
      final accessToken = currentToken != null && currentToken != requestToken
          ? currentToken
          : await _getRefreshedToken();

      if (accessToken == null || accessToken.isEmpty) {
        handler.next(err);
        return;
      }

      request
        ..extra[_retriedKey] = true
        ..headers['Authorization'] = 'Bearer $accessToken';
      handler.resolve(await _client.fetch<dynamic>(request));
    } on Object {
      handler.next(err);
    }
  }

  Future<String?> _getRefreshedToken() async {
    final pending = _refreshInFlight ??= _refreshAccessToken();
    try {
      return await pending;
    } finally {
      if (identical(_refreshInFlight, pending)) _refreshInFlight = null;
    }
  }

  Future<String?> _refreshAccessToken() async {
    final refreshToken = await _tokenStorage.getRefreshToken();
    if (refreshToken == null || refreshToken.isEmpty) {
      await _tokenStorage.clearSession();
      return null;
    }

    try {
      final response = await _refreshClient.post<dynamic>(
        ApiConstants.refresh,
        data: {'refreshToken': refreshToken},
      );
      final body = Map<String, dynamic>.from(response.data as Map);
      final accessToken = body['accessToken'] as String?;
      final rotatedRefreshToken = body['refreshToken'] as String?;
      if (accessToken == null ||
          accessToken.isEmpty ||
          rotatedRefreshToken == null ||
          rotatedRefreshToken.isEmpty) {
        await _tokenStorage.clearSession();
        return null;
      }

      await _tokenStorage.saveTokens(
        accessToken: accessToken,
        refreshToken: rotatedRefreshToken,
      );
      return accessToken;
    } on DioException catch (error) {
      if (error.response?.statusCode == 401) {
        await _tokenStorage.clearSession();
      }
      rethrow;
    }
  }
}
