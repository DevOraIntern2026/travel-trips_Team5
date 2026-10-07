import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'feature/booking/presentation/theme/booking_colors.dart';
import 'feature/booking/presentation/ui/booking_history_screen.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TravelOra',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: BookingColors.primary,
        useMaterial3: true,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      ),
      home: const BookingHistoryScreen(),
    );
  }
}