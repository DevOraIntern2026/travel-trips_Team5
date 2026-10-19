import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/trip.dart';
import '../utils/trip_formatters.dart';
import '../utils/trip_image_resolver.dart';
import 'media_placeholder.dart';

class TrendingTripTile extends StatelessWidget {
  const TrendingTripTile({super.key, required this.trip, required this.onTap});

  final Trip trip;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final destination = trip.destination;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            SizedBox(
              width: 78,
              height: 78,
              child: Stack(
                children: [
                  MediaPlaceholder(
                    seed: trip.id + 3,
                    imageAsset: TripImageResolver.forTrip(trip),
                    height: 78,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  Positioned(
                    left: 6,
                    bottom: 6,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.92),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '${trip.durationDays} Days',
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    destination == null
                        ? 'EXPEDITION'
                        : '${destination.country.toUpperCase()}  ·  ${destination.city.toUpperCase()}',
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 10,
                      letterSpacing: 0.6,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    trip.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 15,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    TripFormatters.nightsLabel(trip.durationDays),
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                      color: AppColors.ink,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            StatusPill(
              label: trip.isActive ? 'Open' : 'Waitlist',
              color: trip.isActive ? AppColors.warning : AppColors.soldOut,
              filled: false,
            ),
          ],
        ),
      ),
    );
  }
}
