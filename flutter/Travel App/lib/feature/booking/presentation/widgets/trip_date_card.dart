import 'package:flutter/material.dart';

import '../../data/models/trip_date_model.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import '../utils/booking_formatters.dart';
import 'booking_chip.dart';

class TripDateCard extends StatelessWidget {
  final TripDateModel date;
  final bool selected;
  final VoidCallback onTap;

  const TripDateCard({
    super.key,
    required this.date,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: BookingColors.surface,
      borderRadius: BorderRadius.circular(BookingSpacing.cardRadius),
      child: InkWell(
        borderRadius: BorderRadius.circular(BookingSpacing.cardRadius),
        onTap: onTap,
        child: Padding(
          padding: BookingSpacing.cardPadding,
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: BookingColors.surfaceSoft,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.calendar_month,
                  color: BookingColors.primary,
                ),
              ),
              const SizedBox(width: BookingSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      formatBookingRange(date.startDate, date.endDate),
                      style: BookingTextStyles.bodyEmphasis,
                    ),
                    const SizedBox(height: BookingSpacing.xs),
                    Text(
                      '${formatPrice(date.price)} / person'
                      '  •  Capacity ${date.capacity}',
                      style: BookingTextStyles.caption,
                    ),
                    const SizedBox(height: BookingSpacing.xs),
                    BookingChip(
                      label: date.isActive ? 'Confirmed Departure' : 'Inactive',
                      background: date.isActive
                          ? BookingColors.successSurface
                          : BookingColors.errorSurface,
                      foreground: date.isActive
                          ? BookingColors.success
                          : BookingColors.error,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: BookingSpacing.sm),
              _SelectedIndicator(isSelected: selected),
            ],
          ),
        ),
      ),
    );
  }
}

class _SelectedIndicator extends StatelessWidget {
  final bool isSelected;

  const _SelectedIndicator({required this.isSelected});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(6),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isSelected
            ? BookingColors.primary
            : BookingColors.surfaceSoft,
      ),
      child: Icon(
        Icons.check,
        size: 16,
        color: isSelected ? BookingColors.surface : BookingColors.surfaceSoft,
      ),
    );
  }
}