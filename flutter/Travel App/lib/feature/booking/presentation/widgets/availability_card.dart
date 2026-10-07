import 'package:flutter/material.dart';

import '../../data/models/availability_model.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import 'booking_chip.dart';
import 'booking_info_card.dart';
import 'booking_primary_button.dart';

class AvailabilityCard extends StatelessWidget {
  final AvailabilityModel availability;
  final VoidCallback onContinue;

  const AvailabilityCard({
    super.key,
    required this.availability,
    required this.onContinue,
  });

  bool get _hasSeats =>
      availability.available && availability.remainingSeats > 0;

  @override
  Widget build(BuildContext context) {
    return BookingInfoCard(
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                '${availability.remainingSeats} '
                'seat${availability.remainingSeats == 1 ? '' : 's'} left',
                style: BookingTextStyles.metricValue,
              ),
            ),
            BookingChip(
              label: _hasSeats ? 'Guaranteed Run' : 'Sold Out',
              background: _hasSeats
                  ? BookingColors.successSurface
                  : BookingColors.errorSurface,
              foreground: _hasSeats
                  ? BookingColors.success
                  : BookingColors.error,
            ),
          ],
        ),
        const SizedBox(height: BookingSpacing.md),
        Text(
          '${availability.bookedSeats} of '
          '${availability.capacity} seats booked',
          style: BookingTextStyles.muted,
        ),
        const SizedBox(height: BookingSpacing.lg),
        _BookedSeatsProgress(availability: availability),
        const SizedBox(height: BookingSpacing.xl),
        if (_hasSeats)
          BookingPrimaryButton(
            text: 'Continue to Booking',
            icon: Icons.arrow_forward,
            onPressed: onContinue,
          )
        else
          const Padding(
            padding: EdgeInsets.symmetric(vertical: BookingSpacing.md),
            child: Center(
              child: Text(
                'No seats available on this departure.',
                style: TextStyle(
                  color: BookingColors.error,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _BookedSeatsProgress extends StatelessWidget {
  final AvailabilityModel availability;

  const _BookedSeatsProgress({required this.availability});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(BookingSpacing.sm),
      child: LinearProgressIndicator(
        value: availability.capacity == 0
            ? 0
            : availability.bookedSeats / availability.capacity,
        minHeight: 8,
        backgroundColor: BookingColors.surfaceSoft,
        valueColor: const AlwaysStoppedAnimation<Color>(BookingColors.primary),
      ),
    );
  }
}