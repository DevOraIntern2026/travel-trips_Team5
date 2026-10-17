import 'package:dio/dio.dart';

/// Shared HTTP client for backend requests.
class ApiClient {
  ApiClient({Dio? dio}) : dio = dio ?? _createDio();

  final Dio dio;

  static Dio _createDio() {
    const configuredBaseUrl = String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: 'http://192.168.1.8:3000/api/v1',
    );

    return Dio(
      BaseOptions(
        baseUrl: '${configuredBaseUrl.replaceFirst(RegExp(r'/+$'), '')}/',
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        sendTimeout: const Duration(seconds: 15),
        headers: const {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ),
    );
  }
}
