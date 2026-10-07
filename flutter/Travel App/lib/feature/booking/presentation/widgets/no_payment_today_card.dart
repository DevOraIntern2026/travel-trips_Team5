import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import 'booking_info_card.dart';

class NoPaymentTodayCard extends StatelessWidget {
  const NoPaymentTodayCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const BookingInfoCard(
      color: BookingColors.surfaceInfo,
      children: [
        Row(
          children: [
            Icon(Icons.verified_user_outlined, color: BookingColors.primary),
            SizedBox(width: BookingSpacing.md),
            Expanded(
              child: Text(
                'No payment charged today. Your reservation is submitted '
                'directly to the trip operator.',
                style: BookingTextStyles.body,
              ),
            ),
          ],
        ),
      ],
    );
  }
}