import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/trip_date_model.dart';
import '../../../../home/data/models/trip_model.dart';
import '../../utils/booking_display.dart';

/// Trip summary card: image, title and starting price.
class AvailabilityTripCard extends StatelessWidget {
  const AvailabilityTripCard({
    super.key,
    required this.trip,
    required this.tripId,
    required this.dates,
    required this.selected,
  });

  final TripModel? trip;
  final int tripId;

  /// All departures of this trip, used to derive the "from" price.
  final List<TripDateModel> dates;

  /// The departure the traveler picked, if any.
  final TripDateModel? selected;

  @override
  Widget build(BuildContext context) {
    // Locals so the null-guards below can promote them.
    final trip = this.trip;
    final minPrice = dates.map((d) => d.price).reduce((a, b) => a < b ? a : b);
    final duration = selected == null ? null : tripDays(selected!);

    return AppCard(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          TripImage(
            url: trip?.imageUrl,
            width: 84,
            height: 84,
            radius: 14,
            child: duration == null
                ? null
                : Align(
                    alignment: Alignment.bottomLeft,
                    child: Container(
                      margin: const EdgeInsets.all(6),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withAlpha(140),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '${duration}D/${duration - 1}N',
                        style: AppText.mono(10, Colors.white),
                      ),
                    ),
                  ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (trip?.location != null)
                  Row(
                    children: [
                      const Icon(
                        Icons.explore_outlined,
                        size: 14,
                        color: AppColors.rust,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          trip!.location!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppText.body(
                            12.5,
                            AppColors.ink.withAlpha(210),
                          ),
                        ),
                      ),
                    ],
                  ),
                const SizedBox(height: 4),
                Text(
                  trip?.title ?? 'Trip #$tripId',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.title(19),
                ),
                const SizedBox(height: 4),
                Text.rich(
                  TextSpan(
                    style: AppText.body(12.5, AppColors.ink.withAlpha(210)),
                    children: [
                      const TextSpan(text: 'From '),
                      TextSpan(
                        text: formatMoney(minPrice),
                        style: AppText.mono(
                          13,
                          AppColors.primary,
                          FontWeight.w700,
                        ),
                      ),
                      const TextSpan(text: ' / person'),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
