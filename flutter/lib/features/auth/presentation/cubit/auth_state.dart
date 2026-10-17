import '../../data/models/auth_response_model.dart';

sealed class AuthState {
  const AuthState();
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthSuccess extends AuthState {
  final AuthResponseModel authResponse;

  const AuthSuccess(this.authResponse);
}

class AuthFailure extends AuthState {
  final String message;

  const AuthFailure(this.message);
}
