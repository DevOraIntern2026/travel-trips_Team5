import 'package:flutter/material.dart';

import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/trip_date_model.dart';
import '../../../../home/data/models/trip_model.dart';
import 'review_info_row.dart';
import '../../utils/booking_display.dart';
import '../../utils/booking_formatters.dart';

/// Trip identity card shown above the fare breakdown.
class ReviewTripCard extends StatelessWidget {
  const ReviewTripCard({
    super.key,
    required this.trip,
    required this.date,
    required this.tripId,
  });

  final TripModel? trip;
  final TripDateModel? date;
  final int tripId;
  @override
  Widget build(BuildContext context) {
    // Local copy so the null guards below can promote it.
    final date = this.date;
    final dur = date == null ? null : daysAndNights(date, sep: ' / ');

    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        children: [
          TripImage(
            url: trip?.imageUrl,
            height: 176,
            radius: 14,
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
                  left: 12,
                  right: 12,
                  bottom: 12,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (trip?.location != null)
                        Row(
                          children: [
                            const Icon(
                              Icons.place_outlined,
                              size: 14,
                              color: Colors.white,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                trip!.location!,
                                style: AppText.body(
                                  12.5,
                                  Colors.white.withAlpha(220),
                                ),
                              ),
                            ),
                          ],
                        ),
                      Text(
                        trip?.title ?? 'Trip #$tripId',
                        style: AppText.title(21, Colors.white),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          if (date != null) ...[
            const SizedBox(height: 12),
            ReviewInfoRow(
              Icons.calendar_today_outlined,
              'Dates & Duration',
              '${formatBookingRange(date.startDate, date.endDate)}${dur == null ? '' : ' ($dur)'}',
            ),
          ],
        ],
      ),
    );
  }
}
