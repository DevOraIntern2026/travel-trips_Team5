import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';

class BookingLoadingState extends StatelessWidget {
  final String message;

  const BookingLoadingState({
    super.key,
    this.message = 'Loading…',
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(BookingSpacing.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(color: BookingColors.primary),
            const SizedBox(height: BookingSpacing.md),
            Text(message, style: const TextStyle(color: BookingColors.textMuted)),
          ],
        ),
      ),
    );
  }
}