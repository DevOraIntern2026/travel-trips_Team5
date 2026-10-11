import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../data/models/booking_model.dart';
import '../../data/models/booking_status.dart';
import '../../data/models/trip_date_model.dart';
import 'booking_details/details_financial.dart';
import 'booking_details/details_hero.dart';
import 'booking_details/details_roadmap.dart';

class BookingDetailsView extends StatelessWidget {
  final BookingModel booking;
  final String status;
  final TripDateModel? tripDate;

  const BookingDetailsView({
    super.key,
    required this.booking,
    required this.status,
    this.tripDate,
  });

  bool get _cancelled => BookingStatus.isCancelled(status);

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
      children: [
        BookingDetailsHero(
          booking: booking,
          status: status,
          tripDate: tripDate,
        ),
        const SizedBox(height: 14),
        if (_cancelled)
          SoftBox(
            color: AppColors.errorSurface,
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                const Icon(Icons.cancel_outlined, color: AppColors.error),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'This reservation was cancelled.',
                    style: AppText.label(13, AppColors.error),
                  ),
                ),
              ],
            ),
          )
        else
          BookingDetailsRoadmap(status: status),
        const SizedBox(height: 14),
        BookingDetailsFinancial(booking: booking, status: status),
        const SizedBox(height: 14),
        SizedBox(
          height: 54,
          child: FilledButton.icon(
            onPressed: () {
              // TODO: message operator
            },
            icon: const Icon(Icons.chat_outlined, size: 19),
            label: Text(
              'Message Operator',
              style: AppText.label(14.5, Colors.white),
            ),
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 52,
          child: FilledButton.icon(
            onPressed: () {
              // TODO: add to calendar
            },
            icon: const Icon(Icons.event_available_outlined, size: 19),
            label: Text(
              'Add to Apple / Google Calendar',
              style: AppText.label(14),
            ),
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.infoSurface,
              foregroundColor: AppColors.ink,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
          ),
        ),
        const SizedBox(height: 14),
        Center(
          child: Text(
            'Cancellation information',
            style: AppText.body(
              14,
              AppColors.ink.withAlpha(220),
              FontWeight.w500,
            ),
          ),
        ),
        Center(
          child: Text(
            'Cancellation terms are set by the trip operator.',
            textAlign: TextAlign.center,
            style: AppText.body(12.5, AppColors.muted),
          ),
        ),
      ],
    );
  }
}
