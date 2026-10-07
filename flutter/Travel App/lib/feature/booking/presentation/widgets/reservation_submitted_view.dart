import 'package:flutter/material.dart';

import '../../data/models/booking_model.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import '../utils/booking_formatters.dart';
import 'booking_info_card.dart';
import 'booking_primary_button.dart';
import 'booking_status_badge.dart';
import 'no_payment_today_card.dart';

class ReservationSubmittedView extends StatelessWidget {
  final BookingModel booking;

  const ReservationSubmittedView({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(BookingSpacing.lg),
      child: Column(
        children: [
          const SizedBox(height: BookingSpacing.md),
          const _SubmittedIcon(),
          const SizedBox(height: BookingSpacing.lg),
          const Text(
            'Reservation Request\nDispatched!',
            textAlign: TextAlign.center,
            style: BookingTextStyles.screenTitle,
          ),
          const SizedBox(height: BookingSpacing.sm),
          Text(
            'We’ve transmitted your reservation for trip '
            '#${booking.tripId} directly to the operator.',
            textAlign: TextAlign.center,
            style: BookingTextStyles.muted,
          ),
          const SizedBox(height: BookingSpacing.xl),
          const NoPaymentTodayCard(),
          const SizedBox(height: BookingSpacing.xl),
          _ReferenceCard(booking: booking),
          const SizedBox(height: BookingSpacing.xl),
          _BookingSummaryCard(booking: booking),
          const SizedBox(height: BookingSpacing.xxl),
          BookingPrimaryButton(
            text: 'View in My Bookings',
            icon: Icons.arrow_forward,
            onPressed: () =>
                Navigator.of(context).popUntil((route) => route.isFirst),
          ),
        ],
      ),
    );
  }
}

class _SubmittedIcon extends StatelessWidget {
  const _SubmittedIcon();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 92,
      height: 92,
      decoration: const BoxDecoration(
        color: BookingColors.successSurface,
        shape: BoxShape.circle,
      ),
      child: Container(
        margin: const EdgeInsets.all(14),
        decoration: const BoxDecoration(
          color: BookingColors.success,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.check, color: BookingColors.surface, size: 36),
      ),
    );
  }
}

class _ReferenceCard extends StatelessWidget {
  final BookingModel booking;

  const _ReferenceCard({required this.booking});

  bool get _isConfirmed => booking.status == 'Confirmed';

  @override
  Widget build(BuildContext context) {
    return BookingInfoCard(
      children: [
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('REFERENCE CODE', style: BookingTextStyles.microLabel),
            Text('SUBMITTED', style: BookingTextStyles.microLabel),
          ],
        ),
        const SizedBox(height: BookingSpacing.sm),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('#${booking.id}', style: BookingTextStyles.cardMetric),
            Text(
              formatBookingDateTime(booking.createdAt),
              style: BookingTextStyles.muted,
            ),
          ],
        ),
        const SizedBox(height: BookingSpacing.lg),
        Container(
          width: double.infinity,
          padding: BookingSpacing.cardPadding,
          decoration: BoxDecoration(
            color: _isConfirmed
                ? BookingColors.successSurface
                : BookingColors.surfaceSoft,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              Icon(
                _isConfirmed ? Icons.check_circle : Icons.hourglass_top,
                color: _isConfirmed
                    ? BookingColors.success
                    : BookingColors.accent,
              ),
              const SizedBox(width: BookingSpacing.md),
              Expanded(
                child: Text(
                  _isConfirmed
                      ? 'Confirmed departure'
                      : 'Awaiting operator confirmation',
                  style: BookingTextStyles.captionEmphasis.copyWith(
                    color: _isConfirmed
                        ? BookingColors.success
                        : BookingColors.error,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _BookingSummaryCard extends StatelessWidget {
  final BookingModel booking;

  const _BookingSummaryCard({required this.booking});

  @override
  Widget build(BuildContext context) {
    return BookingInfoCard(
      children: [
        BookingInfoRow(label: 'Trip', value: '#${booking.tripId}'),
        const SizedBox(height: BookingSpacing.md),
        BookingInfoRow(label: 'Trip date', value: '#${booking.tripDateId}'),
        const SizedBox(height: BookingSpacing.md),
        BookingInfoRow(label: 'Price', value: formatPrice(booking.price)),
        const SizedBox(height: BookingSpacing.md),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Status', style: BookingTextStyles.muted),
            BookingStatusBadge(status: booking.status),
          ],
        ),
      ],
    );
  }
}