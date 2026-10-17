import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/networking/api_result.dart';
import '../../data/models/auth_response_model.dart';
import '../../data/models/login_request_model.dart';
import '../../data/models/register_request_model.dart';
import '../../data/repo/auth_repo.dart';
import 'auth_state.dart';

class AuthCubit extends Cubit<AuthState> {
  final AuthRepo _authRepo;

  AuthCubit(this._authRepo) : super(const AuthInitial());

  Future<void> login({required String email, required String password}) async {
    if (state is AuthLoading) return;

    emit(const AuthLoading());

    final result = await _authRepo.login(
      LoginRequestModel(email: email.trim(), password: password),
    );

    if (isClosed) return;
    _handleResult(result);
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    if (state is AuthLoading) return;

    emit(const AuthLoading());

    final result = await _authRepo.register(
      RegisterRequestModel(
        name: name.trim(),
        email: email.trim(),
        password: password,
      ),
    );

    if (isClosed) return;
    _handleResult(result);
  }

  void _handleResult(ApiResult<AuthResponseModel> result) {
    switch (result) {
      case Success<AuthResponseModel>(:final data):
        emit(AuthSuccess(data));

      case Failure<AuthResponseModel>(:final message):
        emit(AuthFailure(message));
    }
  }
}
