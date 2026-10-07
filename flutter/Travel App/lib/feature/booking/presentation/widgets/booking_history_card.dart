import 'package:flutter/material.dart';

import '../../data/models/booking_model.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import '../utils/booking_formatters.dart';
import 'booking_info_card.dart';
import 'booking_status_badge.dart';

class BookingHistoryCard extends StatelessWidget {
  final BookingModel booking;
  final VoidCallback onTap;

  const BookingHistoryCard({super.key, required this.booking, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return BookingInfoCard(
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'BOOKING #${booking.id}',
                style: BookingTextStyles.microLabel,
              ),
            ),
            BookingStatusBadge(status: booking.status),
          ],
        ),
        const SizedBox(height: BookingSpacing.sm),
        Text(
          'Trip #${booking.tripId} • Departure #${booking.tripDateId}',
          style: BookingTextStyles.bodyStrong,
        ),
        const SizedBox(height: BookingSpacing.sm),
        Text(
          'Booked ${formatBookingDate(booking.createdAt)}',
          style: BookingTextStyles.muted,
        ),
        const SizedBox(height: BookingSpacing.lg),
        _BookingMetaRow(booking: booking),
        const SizedBox(height: BookingSpacing.lg),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: onTap,
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: BookingColors.primary),
              foregroundColor: BookingColors.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            child: const Text(
              'View Details',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
        ),
      ],
    );
  }
}

class _BookingMetaRow extends StatelessWidget {
  final BookingModel booking;

  const _BookingMetaRow({required this.booking});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(BookingSpacing.md),
      decoration: BoxDecoration(
        color: BookingColors.background,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Expanded(child: _MetaChip(label: 'Trip #${booking.tripId}')),
          const SizedBox(width: BookingSpacing.sm),
          Expanded(child: _MetaChip(label: formatPrice(booking.price))),
          const SizedBox(width: BookingSpacing.sm),
          Expanded(child: _MetaChip(label: 'Date #${booking.tripDateId}')),
        ],
      ),
    );
  }
}

class _MetaChip extends StatelessWidget {
  final String label;

  const _MetaChip({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: BookingSpacing.sm,
        vertical: 6,
      ),
      decoration: BoxDecoration(
        color: BookingColors.surface,
        borderRadius: BorderRadius.circular(BookingSpacing.chipRadius),
        border: Border.all(color: BookingColors.border),
      ),
      child: Text(
        label,
        textAlign: TextAlign.center,
        style: BookingTextStyles.captionEmphasis,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }
}