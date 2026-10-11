import 'dart:convert';
import 'dart:typed_data';

import 'package:devora_trips/core/networking/auth_interceptor.dart';
import 'package:devora_trips/core/storage/token_storage.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Captures the headers of the last outgoing request and answers 200.
class _RecordingAdapter implements HttpClientAdapter {
  Map<String, dynamic> lastHeaders = const {};

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    lastHeaders = Map<String, dynamic>.from(options.headers);
    return ResponseBody.fromString(
      jsonEncode({'success': true, 'data': <dynamic>[]}),
      200,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      },
    );
  }

  @override
  void close({bool force = false}) {}
}

Dio _dioWithInterceptor() {
  final dio = Dio(BaseOptions(baseUrl: 'http://localhost:3000/api/v1/'));
  dio.interceptors.add(
    AuthInterceptor(TokenStorage(), dio, 'http://localhost:3000/api/v1/'),
  );
  return dio;
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('AuthInterceptor', () {
    setUp(() => SharedPreferences.setMockInitialValues({}));

    test('attaches the saved access token as a Bearer header', () async {
      SharedPreferences.setMockInitialValues({'access_token': 'saved-token'});
      final adapter = _RecordingAdapter();
      final dio = _dioWithInterceptor()..httpClientAdapter = adapter;

      await dio.get<dynamic>('bookings');

      expect(adapter.lastHeaders['Authorization'], 'Bearer saved-token');
    });

    test('sends no Authorization header when there is no session', () async {
      final adapter = _RecordingAdapter();
      final dio = _dioWithInterceptor()..httpClientAdapter = adapter;

      await dio.get<dynamic>('bookings');

      expect(adapter.lastHeaders.containsKey('Authorization'), isFalse);
    });

    test('does not attach a token to the public auth endpoints', () async {
      SharedPreferences.setMockInitialValues({'access_token': 'saved-token'});
      final adapter = _RecordingAdapter();
      final dio = _dioWithInterceptor()..httpClientAdapter = adapter;

      await dio.post<dynamic>(
        'auth/login',
        data: {'email': 'a@b.co', 'password': 'x'},
      );

      expect(adapter.lastHeaders.containsKey('Authorization'), isFalse);
    });
  });
}
