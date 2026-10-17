import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/booking_model.dart';
import '../../../data/models/trip_date_model.dart';
import '../../../../home/data/models/trip_model.dart';
import '../../utils/booking_display.dart';
import '../../utils/booking_formatters.dart';

/// What was booked: trip, departure and price.
class SubmittedTripCard extends StatelessWidget {
  const SubmittedTripCard({
    super.key,
    required this.booking,
    this.date,
    this.trip,
  });
  final BookingModel booking;
  final TripDateModel? date;
  final TripModel? trip;
  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: EdgeInsets.zero,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Column(
          children: [
            TripImage(
              url: trip?.imageUrl,
              height: 160,
              radius: 0,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  const DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.center,
                        end: Alignment.bottomCenter,
                        colors: [Color(0x00000000), Color(0xB3000000)],
                      ),
                    ),
                  ),
                  Positioned(
                    left: 14,
                    bottom: 12,
                    right: 14,
                    child: Text(
                      trip?.title ?? 'Trip #${booking.tripId}',
                      style: AppText.title(22, Colors.white),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (date != null)
                        Expanded(
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const AppIconBox(
                                Icons.calendar_today_outlined,
                                size: 38,
                                radius: 10,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Dates',
                                      style: AppText.body(
                                        11.5,
                                        AppColors.ink.withAlpha(190),
                                      ),
                                    ),
                                    Text(
                                      formatBookingRange(
                                        date!.startDate,
                                        date!.endDate,
                                      ),
                                      style: AppText.label(13.5),
                                    ),
                                    if (daysAndNights(date!, sep: ' / ') !=
                                        null)
                                      Text(
                                        daysAndNights(date!, sep: ' / ')!,
                                        style: AppText.mono(10.5),
                                      ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      Expanded(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const AppIconBox(
                              Icons.groups_2_outlined,
                              size: 38,
                              radius: 10,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Travelers',
                                    style: AppText.body(
                                      11.5,
                                      AppColors.ink.withAlpha(190),
                                    ),
                                  ),
                                  Text('1 Guest', style: AppText.label(13.5)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SoftBox(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.receipt_long_outlined,
                              size: 15,
                              color: AppColors.rust,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Estimated Value',
                              style: AppText.label(
                                12,
                                AppColors.ink,
                                FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text.rich(
                          TextSpan(
                            children: [
                              TextSpan(
                                text: formatMoney(booking.price),
                                style: AppText.title(23, AppColors.primary),
                              ),
                              TextSpan(text: ' USD', style: AppText.mono(11)),
                            ],
                          ),
                        ),
                        Text(
                          'Payment terms set by operator',
                          style: AppText.label(12, AppColors.error),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
