import 'package:flutter/material.dart';
import 'package:travel_app/feature/auth/presentation/views/login/widgets/login_view_body.dart';

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: LoginViewBody());
  }
}