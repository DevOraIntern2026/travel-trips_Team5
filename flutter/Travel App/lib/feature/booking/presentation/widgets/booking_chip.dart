import 'package:flutter/material.dart';

import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';

class BookingChip extends StatelessWidget {
  final String label;
  final Color background;
  final Color foreground;

  const BookingChip({
    super.key,
    required this.label,
    required this.background,
    required this.foreground,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(BookingSpacing.chipRadius),
      ),
      child: Text(
        label,
        style: BookingTextStyles.chipLabel.copyWith(color: foreground),
      ),
    );
  }
}