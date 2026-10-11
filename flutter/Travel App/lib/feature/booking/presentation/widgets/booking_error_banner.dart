import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';

class BookingErrorBanner extends StatelessWidget {
  final String message;
  const BookingErrorBanner({super.key, required this.message});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: BookingSpacing.cardPadding,
      decoration: BoxDecoration(
        color: BookingColors.errorSurface,
        borderRadius: BorderRadius.circular(BookingSpacing.cardRadius),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: BookingColors.error),
          const SizedBox(width: BookingSpacing.md),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                color: BookingColors.error,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
