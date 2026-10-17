import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/utils/text_format.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/availability_model.dart';
import '../../../data/models/trip_date_model.dart';
import '../../utils/booking_display.dart';
import '../../utils/booking_formatters.dart';

/// A bookable departure with capacity and status pills.
class DepartureCard extends StatelessWidget {
  const DepartureCard({
    super.key,
    required this.date,
    required this.selected,
    required this.availability,
    required this.onTap,
  });

  final TripDateModel date;
  final bool selected;
  final AvailabilityModel? availability;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final inactive =
        !date.isActive ||
        date.bookedSeats >= date.capacity ||
        (selected && availability != null && !availability!.available);
    final soldOut =
        inactive ||
        (selected && availability != null && availability!.remainingSeats <= 0);
    final a = availability;

    final chips = <Widget>[];
    if (soldOut) {
      chips.add(
        const AppPill(
          'Sold Out',
          background: AppColors.errorSurface,
          foreground: AppColors.error,
          icon: Icons.block,
          mono: true,
          fontSize: 10.5,
        ),
      );
    } else if (selected && a != null) {
      if (a.available && a.remainingSeats > 0) {
        final low = a.remainingSeats <= 3;
        chips.add(
          AppPill(
            low
                ? '${plural(a.remainingSeats, 'seat')} left'
                : '${a.remainingSeats} seats available',
            background: low
                ? AppColors.pendingSurface
                : AppColors.infoPanelSurface,
            foreground: low
                ? AppColors.pendingTextStrong
                : AppColors.infoPanelText,
            icon: low
                ? Icons.local_fire_department_outlined
                : Icons.group_outlined,
            fontSize: 11,
          ),
        );
        chips.add(
          const AppPill(
            'Availability checked',
            background: AppColors.mint,
            foreground: AppColors.primary,
            icon: Icons.verified_outlined,
            fontSize: 11,
          ),
        );
      } else {
        chips.add(
          const AppPill(
            'Sold Out',
            background: AppColors.errorSurface,
            foreground: AppColors.error,
            fontSize: 11,
          ),
        );
      }
    } else {
      chips.add(
        AppPill(
          'Capacity ${date.capacity}',
          background: AppColors.infoPanelSurface,
          foreground: AppColors.infoPanelText,
          icon: Icons.group_outlined,
          fontSize: 11,
        ),
      );
    }

    final strike = soldOut
        ? const TextStyle(decoration: TextDecoration.lineThrough)
        : null;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: inactive ? AppColors.infoSurface.withAlpha(160) : null,
          gradient: inactive
              ? null
              : LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    selected ? const Color(0xFFD9F2EA) : Colors.white,
                    Colors.white,
                  ],
                ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected
                ? AppColors.primary.withAlpha(90)
                : Colors.transparent,
            width: 1.2,
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(spacing: 8, runSpacing: 6, children: chips),
                  const SizedBox(height: 10),
                  Text(
                    formatBookingRange(date.startDate, date.endDate),
                    style: AppText.title(20).copyWith(
                      decoration: inactive ? TextDecoration.lineThrough : null,
                      color: soldOut ? AppColors.muted : AppColors.ink,
                    ),
                  ),
                  if (daysAndNights(date) != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      daysAndNights(date)!,
                      style: AppText.body(13, AppColors.ink.withAlpha(190)),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (!soldOut)
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.primary
                          : AppColors.infoSurface,
                      shape: BoxShape.circle,
                    ),
                    child: selected
                        ? const Icon(Icons.check, size: 17, color: Colors.white)
                        : null,
                  ),
                const SizedBox(height: 10),
                Text(
                  formatMoney(date.price),
                  style: AppText.mono(
                    17,
                    inactive ? AppColors.muted : AppColors.primary,
                    FontWeight.w700,
                  ).merge(strike),
                ),
                Text('/ person', style: AppText.body(11.5, AppColors.muted)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
