import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_state_buttons.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Matrix state 01 - someone else took the last seats.
/// Matrix state 01 — someone else took the last seats.
class SeatCollisionView extends StatelessWidget {
  const SeatCollisionView({
    super.key,
    required this.tripTitle,
    this.dateRange,
    this.imageUrl,
    required this.onSwitchDeparture,
    required this.onReturn,
    this.onWaitlist,
  });

  final String tripTitle;
  final String? dateRange;
  final String? imageUrl;
  final VoidCallback onSwitchDeparture;
  final VoidCallback onReturn;
  final VoidCallback? onWaitlist;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: AppPill(
              'SEAT COLLISION • REVIEW STEP',
              background: AppColors.errorSurface,
              foreground: AppColors.error,
              dot: true,
              mono: true,
              fontSize: 10.5,
            ),
          ),
          const SizedBox(height: 12),
          SoftBox(
            color: AppColors.errorSurface,
            padding: const EdgeInsets.all(14),
            radius: 16,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const AppIconBox(
                  Icons.notifications_active_outlined,
                  background: AppColors.coral,
                  foreground: Colors.white,
                  size: 44,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'This departure is no longer available',
                        style: AppText.title(18),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Availability changed while your booking was being submitted. No booking was created for this departure.',
                        style: AppText.body(13.5, AppColors.ink.withAlpha(200)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SoftBox(
            child: Row(
              children: [
                TripImage(url: imageUrl, width: 64, height: 64, radius: 10),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          AppPill(
                            '0 seats left',
                            background: AppColors.errorSurface,
                            foreground: AppColors.error,
                            mono: true,
                            fontSize: 10.5,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Sold Out',
                            style: AppText.label(12, AppColors.error),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        tripTitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppText.title(
                          16,
                        ).copyWith(decoration: TextDecoration.lineThrough),
                      ),
                      if (dateRange != null)
                        Text(
                          dateRange!,
                          style: AppText.body(
                            12.5,
                            AppColors.muted,
                          ).copyWith(decoration: TextDecoration.lineThrough),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.infoSurface.withAlpha(110),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                const Icon(Icons.bookmark_border, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Choose another available departure to continue.',
                    style: AppText.body(12.5, AppColors.ink.withAlpha(210)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          AppStateActionButton(
            label: 'Choose Another Departure',
            icon: Icons.event_repeat_outlined,
            onPressed: onSwitchDeparture,
          ),
          if (onWaitlist != null) ...[
            const SizedBox(height: 8),
            AppStateSecondaryButton(
              label: 'Join Waitlist',
              icon: Icons.notifications_none,
              onPressed: onWaitlist!,
            ),
          ],
          TextButton(
            onPressed: onReturn,
            child: Text(
              'Return to Trip Overview',
              style: AppText.label(13, AppColors.ink.withAlpha(210)),
            ),
          ),
        ],
      ),
    );
  }
}
