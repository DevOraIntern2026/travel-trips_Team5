import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';

class BookingErrorState extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const BookingErrorState({super.key, required this.message, this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(BookingSpacing.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: double.infinity,
              padding: BookingSpacing.cardPadding,
              decoration: BoxDecoration(
                color: BookingColors.errorSurface,
                borderRadius: BorderRadius.circular(BookingSpacing.cardRadius),
              ),
              child: Text(
                message,
                style: const TextStyle(
                  color: BookingColors.error,
                  fontWeight: FontWeight.w700,
                  height: 1.4,
                ),
              ),
            ),
            if (onRetry != null) ...[
              const SizedBox(height: BookingSpacing.md),
              TextButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh, color: BookingColors.primary),
                label: const Text(
                  'Try again',
                  style: TextStyle(
                    color: BookingColors.primary,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}