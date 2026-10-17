import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/currency_format.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../data/models/trip_model.dart';

class HomeTrendingCard extends StatelessWidget {
  const HomeTrendingCard({super.key, required this.trip, required this.onTap});

  final TripModel trip;
  final ValueChanged<TripModel> onTap;

  @override
  Widget build(BuildContext context) {
    final meta = <String>[
      if (trip.location != null) trip.location!.toUpperCase(),
      if (trip.category != null) trip.category!.toUpperCase(),
    ].join(' • ');
    final low = trip.seatsLeft != null && trip.seatsLeft! <= 3;

    return InkWell(
      onTap: () => onTap(trip),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Row(
          children: [
            TripImage(
              url: trip.imageUrl,
              width: 96,
              height: 96,
              radius: 14,
              child: trip.durationDays == null
                  ? null
                  : Align(
                      alignment: Alignment.bottomCenter,
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black.withAlpha(140),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${trip.durationDays} Days',
                          style: AppText.mono(10.5, Colors.white),
                        ),
                      ),
                    ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Text(
                          meta,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: AppText.mono(10.5, AppColors.brandBlue),
                        ),
                      ),
                      if (trip.seatsLeft != null)
                        AppPill(
                          '${trip.seatsLeft} seats${low ? ' left' : ''}',
                          background: low
                              ? AppColors.errorSurface
                              : AppColors.mint,
                          foreground: low ? AppColors.error : AppColors.success,
                          dot: low,
                          fontSize: 10.5,
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    trip.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppText.title(16),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Expanded(
                        child: trip.price == null
                            ? const SizedBox.shrink()
                            : Text(
                                formatMoney(trip.price!),
                                style: AppText.title(18, AppColors.primary),
                              ),
                      ),
                      Container(
                        width: 34,
                        height: 34,
                        decoration: const BoxDecoration(
                          color: AppColors.infoSurface,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.chevron_right,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
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
