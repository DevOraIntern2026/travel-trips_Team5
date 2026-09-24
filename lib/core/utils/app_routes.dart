import 'package:flutter/material.dart';
import 'package:travel_app/feature/auth/presentation/views/forget_password/forget_password_view.dart';
import 'package:travel_app/feature/auth/presentation/views/login/login_view.dart';
import 'package:travel_app/feature/auth/presentation/views/register/register_view.dart';
import 'package:travel_app/feature/home/presentation/view/home_view.dart';
import 'package:travel_app/feature/splash/presentaion/view/splash_view.dart';

abstract final class AppRoute {
  static final splashRoute = MaterialPageRoute(
    builder: (context) => SplashView(),
  );
   static final loginRoute = MaterialPageRoute(
    builder: (context) => LoginView(),
  );
   static final registerRoute = MaterialPageRoute(
    builder: (context) => RegisterView(),
  );
   static final forgetPasswordRoute = MaterialPageRoute(
    builder: (context) => ForgetPasswordView(),
  );
    static final homeRoute = MaterialPageRoute(
    builder: (context) => HomeView(),
  );
}
