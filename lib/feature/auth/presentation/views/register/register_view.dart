import 'package:flutter/material.dart';
import 'package:travel_app/feature/auth/presentation/views/register/widgets/register_view_body.dart';

class RegisterView extends StatelessWidget {
  const RegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: RegisterViewBody());
  }
}