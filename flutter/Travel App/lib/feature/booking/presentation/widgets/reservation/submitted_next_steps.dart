import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/booking_model.dart';
import '../../../../home/data/models/trip_model.dart';

/// "What happens next" roadmap.
class SubmittedNextSteps extends StatelessWidget {
  const SubmittedNextSteps({super.key, required this.booking, this.trip});
  final BookingModel booking;
  final TripModel? trip;
  @override
  Widget build(BuildContext context) {
    const steps = <(String, String)>[
      (
        '1. Booking request received',
        'Your booking status is shown above and in My Bookings.',
      ),
      (
        '2. Check your booking status',
        'Open My Bookings for the latest status returned by the service.',
      ),
      (
        '3. Review trip details',
        'Check your selected dates and the operator’s trip information.',
      ),
      (
        '4. Prepare for departure',
        'Follow the trip information provided by the operator.',
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
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.coral,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text('What Happens Next?', style: AppText.title(18)),
              ),
              Text('4 Steps', style: AppText.mono(11.5)),
            ],
          ),
          const SizedBox(height: 14),
          for (var i = 0; i < steps.length; i++)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: i == 0 ? AppColors.primary : AppColors.infoSurface,
                      shape: BoxShape.circle,
                    ),
                    child: i == 0
                        ? const Icon(Icons.check, size: 15, color: Colors.white)
                        : Center(
                            child: Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: i == 1
                                    ? AppColors.primary
                                    : AppColors.muted,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Container(
                      padding: i == 0
                          ? const EdgeInsets.all(10)
                          : EdgeInsets.zero,
                      decoration: BoxDecoration(
                        color: i == 0 ? AppColors.infoSurface : null,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  steps[i].$1,
                                  style: AppText.title(15),
                                ),
                              ),
                              if (i == 0)
                                const AppPill(
                                  'Current',
                                  background: AppColors.mint,
                                  foreground: AppColors.primary,
                                  mono: true,
                                  fontSize: 10,
                                ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            steps[i].$2,
                            style: AppText.body(
                              12.5,
                              AppColors.ink.withAlpha(200),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
