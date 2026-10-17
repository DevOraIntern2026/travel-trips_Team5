import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import 'booking_info_card.dart';

class TripHeaderCard extends StatelessWidget {
  final int tripId;

  const TripHeaderCard({super.key, required this.tripId});

  @override
  Widget build(BuildContext context) {
    return BookingInfoCard(
      children: [
        Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: BookingColors.surfaceSoft,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.terrain, color: BookingColors.primary),
            ),
            const SizedBox(width: BookingSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Trip', style: BookingTextStyles.caption),
                  Text('Trip #$tripId', style: BookingTextStyles.bodyStrong),
                  const SizedBox(height: BookingSpacing.xs),
                  const Text(
                    'Select a departure and check live availability',
                    style: BookingTextStyles.caption,
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
