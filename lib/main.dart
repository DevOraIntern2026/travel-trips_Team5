import 'package:flutter/material.dart';
import 'package:travel_app/feature/auth/presentation/views/login/login_view.dart';

void main() {
  runApp(const TravelApp());
}

class TravelApp extends StatelessWidget {
  const TravelApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginView());

   
  }
}
