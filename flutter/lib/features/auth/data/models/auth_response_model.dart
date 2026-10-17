import 'user_model.dart';

/// Session returned by `POST /auth/register` (201) and `POST /auth/login` (200).
///
/// Verified against the running backend: the body is flat, not wrapped in
/// `{ success, data }`, and always carries `user`, `accessToken` and
/// `refreshToken`.
class AuthResponseModel {
  final String accessToken;
  final String refreshToken;
  final UserModel user;

  const AuthResponseModel({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  factory AuthResponseModel.fromJson(Map<String, dynamic> json) {
    return AuthResponseModel(
      accessToken: json['accessToken'] as String? ?? '',
      refreshToken: json['refreshToken'] as String? ?? '',
      user: UserModel.fromJson(
        (json['user'] as Map<String, dynamic>?) ?? const {},
      ),
    );
  }
}
