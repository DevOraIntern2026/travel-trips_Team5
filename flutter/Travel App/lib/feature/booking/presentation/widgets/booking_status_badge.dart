import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import 'booking_chip.dart';

class BookingStatusBadge extends StatelessWidget {
  final String status;

  const BookingStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    switch (status) {
      case 'Confirmed':
        return const BookingChip(
          label: 'Confirmed',
          background: BookingColors.successSurface,
          foreground: BookingColors.success,
        );
      case 'Cancelled':
        return const BookingChip(
          label: 'Cancelled',
          background: BookingColors.errorSurface,
          foreground: BookingColors.error,
        );
      default:
        return BookingChip(
          label: status,
          background: BookingColors.surfaceSoft,
          foreground: BookingColors.primary,
        );
    }
  }
}
