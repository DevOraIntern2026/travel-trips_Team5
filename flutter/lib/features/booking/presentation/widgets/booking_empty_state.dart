import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';

class BookingEmptyState extends StatelessWidget {
  final String message;
  final String? hint;
  final IconData icon;

  const BookingEmptyState({
    super.key,
    required this.message,
    this.hint,
    this.icon = Icons.inbox_outlined,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(BookingSpacing.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 56, color: BookingColors.textMuted),
            const SizedBox(height: BookingSpacing.md),
            Text(message, style: BookingTextStyles.bodyStrong),
            if (hint != null) ...[
              const SizedBox(height: BookingSpacing.xs),
              Text(hint!, style: BookingTextStyles.muted),
            ],
          ],
        ),
      ),
    );
  }
}
