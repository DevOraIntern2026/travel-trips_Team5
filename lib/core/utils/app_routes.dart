import 'package:flutter/material.dart';
import 'package:travel_app/feature/auth/presentation/views/forget_password/forget_password_view.dart';
import 'package:travel_app/feature/auth/presentation/views/login/login_view.dart';
import 'package:travel_app/feature/auth/presentation/views/register/register_view.dart';
import 'package:travel_app/feature/home/presentation/view/home_view.dart';
import 'package:travel_app/feature/splash/presentaion/view/splash_view.dart';


abstract final class AppRoute {

  static MaterialPageRoute get splashRoute => MaterialPageRoute(
        builder: (context) => const SplashView(),
      );

  static MaterialPageRoute get loginRoute => MaterialPageRoute(
        builder: (context) => const LoginView(),
      );

  static MaterialPageRoute get registerRoute => MaterialPageRoute(
        builder: (context) => const RegisterView(),
      );

  static MaterialPageRoute get forgetPasswordRoute => MaterialPageRoute(
        builder: (context) => const ForgetPasswordView(),
      );

  static MaterialPageRoute get homeRoute => MaterialPageRoute(
        builder: (context) => const HomeView(),
      );

  static MaterialPageRoute get forgetPassword => MaterialPageRoute(
        builder: (context) => const ForgetPasswordView(),
      );
}