import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../../../core/widgets/app_sticky_bottom_bar.dart';
import '../../cubit/booking_cubit.dart';

/// Sticky bar at the bottom of the review screen: a one-seat reminder and the
/// primary "Confirm Booking" action, disabled until the terms are accepted.
class ReviewBottomBar extends StatelessWidget {
  const ReviewBottomBar({
    super.key,
    required this.dateId,
    required this.agreed,
    required this.onAgreeChanged,
  });

  /// The departure being booked; sent verbatim to `POST /bookings`.
  final int dateId;

  /// Whether the operator terms checkbox is ticked.
  final bool agreed;

  final ValueChanged<bool> onAgreeChanged;

  @override
  Widget build(BuildContext context) {
    return AppStickyBottomBar(
      topPadding: 10,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.verified_user_outlined, size: 14),
              const SizedBox(width: 6),
              Text(
                'One seat • Payment terms set by operator',
                style: AppText.label(11.5, AppColors.ink, FontWeight.w500),
              ),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: FilledButton(
              onPressed: agreed
                  ? () => context.read<BookingCubit>().createBooking(dateId)
                  : null,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.coral,
                disabledBackgroundColor: AppColors.coral.withAlpha(120),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Confirm Booking (1 Seat)',
                    style: AppText.label(16, Colors.white),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.arrow_forward_rounded, size: 19),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
