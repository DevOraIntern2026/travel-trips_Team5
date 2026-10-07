import 'package:flutter/material.dart';

import '../../data/models/booking_model.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import '../utils/booking_formatters.dart';
import 'booking_info_card.dart';
import 'booking_status_badge.dart';

class BookingDetailsView extends StatelessWidget {
  final BookingModel booking;
  final String status;

  const BookingDetailsView({
    super.key,
    required this.booking,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: BookingSpacing.screenPadding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _BookingHeaderCard(booking: booking, status: status),
          const BookingSectionTitle('Trip Information'),
          BookingInfoCard(
            children: [
              BookingInfoRow(label: 'Trip', value: '#${booking.tripId}'),
              const Divider(height: BookingSpacing.xxl),
              BookingInfoRow(
                label: 'Trip date',
                value: '#${booking.tripDateId}',
              ),
            ],
          ),
          const BookingSectionTitle('Booking Information'),
          BookingInfoCard(
            children: [
              BookingInfoRow(label: 'Booking ID', value: '#${booking.id}'),
              const Divider(height: BookingSpacing.xxl),
              BookingInfoRow(
                label: 'Customer ID',
                value: '#${booking.customerId}',
              ),
              const Divider(height: BookingSpacing.xxl),
              BookingInfoRow(
                label: 'Created',
                value: formatBookingDateTime(booking.createdAt),
              ),
            ],
          ),
          const BookingSectionTitle('Financial Summary'),
          _FinancialSummaryCard(price: booking.price),
        ],
      ),
    );
  }
}

class _BookingHeaderCard extends StatelessWidget {
  final BookingModel booking;
  final String status;

  const _BookingHeaderCard({required this.booking, required this.status});

  bool get _isConfirmed => status == 'Confirmed';

  @override
  Widget build(BuildContext context) {
    return BookingInfoCard(
      children: [
        const Text('BOOKING ID', style: BookingTextStyles.microLabel),
        const SizedBox(height: BookingSpacing.xs),
        Text('#${booking.id}', style: BookingTextStyles.displayNumber),
        const SizedBox(height: BookingSpacing.md),
        Row(
          children: [
            Icon(
              _isConfirmed ? Icons.check_circle : Icons.cancel,
              color: _isConfirmed
                  ? BookingColors.success
                  : BookingColors.error,
              size: 18,
            ),
            const SizedBox(width: BookingSpacing.sm),
            BookingStatusBadge(status: status),
            const Spacer(),
            Text(
              formatBookingDateTime(booking.createdAt),
              style: BookingTextStyles.caption,
            ),
          ],
        ),
      ],
    );
  }
}

class _FinancialSummaryCard extends StatelessWidget {
  final double price;

  const _FinancialSummaryCard({required this.price});

  @override
  Widget build(BuildContext context) {
    return BookingInfoCard(
      color: BookingColors.surfaceInfo,
      children: [
        Row(
          children: [
            const Icon(Icons.lock_outline, color: BookingColors.primary),
            const SizedBox(width: BookingSpacing.md),
            const Expanded(
              child: Text(
                'No payment charged today. '
                'Settled on operator confirmation.',
                style: BookingTextStyles.body,
              ),
            ),
            const SizedBox(width: BookingSpacing.md),
            Text(formatPrice(price), style: BookingTextStyles.metricValue),
          ],
        ),
      ],
    );
  }
}