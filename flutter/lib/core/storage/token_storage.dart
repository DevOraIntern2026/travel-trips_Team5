import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../../features/auth/data/models/user_model.dart';

class TokenStorage {
  static const String _tokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userKey = 'user_data';

  Future<void> saveSession({
    required String token,
    required String refreshToken,
    required UserModel user,
  }) async {
    final preferences = await SharedPreferences.getInstance();

    await preferences.setString(_tokenKey, token);
    await preferences.setString(_refreshTokenKey, refreshToken);
    await preferences.setString(_userKey, jsonEncode(user.toJson()));
  }

  Future<String?> getRefreshToken() async {
    final preferences = await SharedPreferences.getInstance();
    return preferences.getString(_refreshTokenKey);
  }

  Future<void> saveUser(UserModel user) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(_userKey, jsonEncode(user.toJson()));
  }

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(_tokenKey, accessToken);
    await preferences.setString(_refreshTokenKey, refreshToken);
  }

  Future<String?> getToken() async {
    final preferences = await SharedPreferences.getInstance();
    return preferences.getString(_tokenKey);
  }

  Future<UserModel?> getUser() async {
    final preferences = await SharedPreferences.getInstance();
    final userData = preferences.getString(_userKey);

    if (userData == null) {
      return null;
    }

    final userJson = jsonDecode(userData) as Map<String, dynamic>;
    return UserModel.fromJson(userJson);
  }

  Future<bool> hasSession() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  Future<void> clearSession() async {
    final preferences = await SharedPreferences.getInstance();

    await preferences.remove(_tokenKey);
    await preferences.remove(_refreshTokenKey);
    await preferences.remove(_userKey);
  }
}
