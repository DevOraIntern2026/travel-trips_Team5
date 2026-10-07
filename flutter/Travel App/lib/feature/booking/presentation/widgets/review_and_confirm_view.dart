import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../cubit/booking_cubit.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';
import 'booking_chip.dart';
import 'booking_error_banner.dart';
import 'booking_info_card.dart';
import 'booking_primary_button.dart';
import 'no_payment_today_card.dart';

class ReviewAndConfirmView extends StatelessWidget {
  final int tripId;
  final int dateId;
  final String? errorMessage;

  const ReviewAndConfirmView({
    super.key,
    required this.tripId,
    required this.dateId,
    this.errorMessage,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(BookingSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              BookingChip(
                label: 'READY TO DISPATCH',
                background: BookingColors.surfaceSoft,
                foreground: BookingColors.primary,
              ),
              SizedBox(width: BookingSpacing.md),
              Text('Instant holding', style: BookingTextStyles.muted),
            ],
          ),
          const SizedBox(height: BookingSpacing.lg),
          const Text('Review & Confirm', style: BookingTextStyles.screenTitle),
          const SizedBox(height: BookingSpacing.sm),
          const Text(
            'No payment charged today',
            style: BookingTextStyles.muted,
          ),
          if (errorMessage != null) ...[
            const SizedBox(height: BookingSpacing.lg),
            BookingErrorBanner(message: errorMessage!),
          ],
          const SizedBox(height: BookingSpacing.lg),
          const NoPaymentTodayCard(),
          const SizedBox(height: BookingSpacing.lg),
          BookingInfoCard(
            title: 'Booking Summary',
            children: [
              BookingInfoRow(label: 'Trip', value: '#$tripId'),
              const SizedBox(height: BookingSpacing.md),
              BookingInfoRow(label: 'Departure', value: '#$dateId'),
              const SizedBox(height: BookingSpacing.md),
              const BookingInfoRow(
                label: 'Payment',
                value: 'On arrival / operator invoice',
              ),
            ],
          ),
          const SizedBox(height: BookingSpacing.xxl),
          BookingPrimaryButton(
            text: 'Confirm Booking',
            icon: Icons.arrow_forward,
            onPressed: () =>
                context.read<BookingCubit>().createBooking(dateId),
          ),
        ],
      ),
    );
  }
}