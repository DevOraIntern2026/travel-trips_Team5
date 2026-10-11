import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/booking_status.dart';

/// Step-by-step "what happens next" roadmap.
class BookingDetailsRoadmap extends StatelessWidget {
  const BookingDetailsRoadmap({super.key, required this.status});

  final String status;

  /// Step 1 is active once the booking is confirmed, step 0 while pending.
  int get _stage => BookingStatus.isConfirmed(status) ? 1 : 0;

  @override
  Widget build(BuildContext context) {
    final items = <(String, String, String, IconData)>[
      (
        '1. Reservation submitted',
        'Your reservation request was received by the booking service.',
        'Received',
        Icons.hourglass_top,
      ),
      (
        '2. Booking status',
        'The status shown above is the latest state returned by the service.',
        status,
        Icons.event_available_outlined,
      ),
      (
        '3. Before departure',
        'Review your trip dates and any instructions provided by the operator.',
        'Upcoming',
        Icons.backpack_outlined,
      ),
      (
        '4. Trip complete',
        'Your booking history will remain available in My Bookings.',
        'After trip',
        Icons.workspace_premium_outlined,
      ),
    ];

    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 9,
                height: 9,
                decoration: const BoxDecoration(
                  color: AppColors.rust,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text('Reservation Roadmap', style: AppText.title(18)),
              ),
              Text('Stage ${_stage + 1} of 4', style: AppText.mono(11.5)),
            ],
          ),
          const SizedBox(height: 14),
          for (var i = 0; i < items.length; i++) _roadmapItem(i, items[i]),
          SoftBox(
            color: AppColors.infoSurface,
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.verified_user_outlined, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Operator cancellation terms',
                        style: AppText.label(13.5),
                      ),
                      Text(
                        'Cancellation requests are subject to the operator’s cancellation window for this trip.',
                        style: AppText.body(12.5, AppColors.ink.withAlpha(210)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _roadmapItem(int i, (String, String, String, IconData) item) {
    final done = i < _stage;
    final current = i == _stage;
    final tag = done
        ? 'Completed'
        : current
        ? (i == 0 ? 'In Progress' : 'Active')
        : item.$3;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 26,
            height: 26,
            decoration: BoxDecoration(
              color: done
                  ? AppColors.primary
                  : current
                  ? AppColors.coral
                  : AppColors.infoSurface,
              shape: BoxShape.circle,
            ),
            child: Icon(
              done ? Icons.check : item.$4,
              size: 14,
              color: done || current ? Colors.white : AppColors.muted,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              padding: current ? const EdgeInsets.all(12) : EdgeInsets.zero,
              decoration: BoxDecoration(
                color: current ? AppColors.infoSurface : null,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.$1,
                          style: AppText.title(
                            15.5,
                            current ? AppColors.rust : AppColors.ink,
                          ),
                        ),
                      ),
                      current
                          ? AppPill(
                              tag,
                              background: Colors.white,
                              foreground: AppColors.rust,
                              mono: true,
                              fontSize: 10,
                            )
                          : Text(tag, style: AppText.mono(10.5)),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    item.$2,
                    style: AppText.body(12.5, AppColors.ink.withAlpha(210)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
