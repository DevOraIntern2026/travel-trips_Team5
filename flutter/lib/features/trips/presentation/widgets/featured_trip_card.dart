import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/trip.dart';
import '../utils/trip_formatters.dart';
import '../utils/trip_image_resolver.dart';
import 'media_placeholder.dart';

class FeaturedTripCard extends StatelessWidget {
  const FeaturedTripCard({
    super.key,
    required this.trip,
    required this.onViewTrip,
    this.onOpenDestination,
  });

  final Trip trip;
  final VoidCallback onViewTrip;
  final VoidCallback? onOpenDestination;

  @override
  Widget build(BuildContext context) {
    final destination = trip.destination;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: MediaPlaceholder(
        seed: trip.id,
        imageAsset: TripImageResolver.forTrip(trip),
        height: 290,
        overlay: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.black.withValues(alpha: 0.05),
            Colors.black.withValues(alpha: 0.72),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  StatusPill(
                    label: trip.isActive
                        ? 'Confirmed Departure'
                        : 'Unavailable',
                    color: trip.isActive
                        ? AppColors.success
                        : AppColors.soldOut,
                  ),
                  const Spacer(),
                  const CircleAvatar(
                    radius: 16,
                    backgroundColor: Colors.white,
                    child: Icon(
                      Icons.favorite_border,
                      size: 16,
                      color: AppColors.forest,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              GestureDetector(
                onTap: onOpenDestination,
                child: Text(
                  '${trip.durationDays} DAYS  ·  ${destination == null ? TripFormatters.location(trip).toUpperCase() : '${destination.city.toUpperCase()}, ${destination.country.toUpperCase()}'}',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 11,
                    letterSpacing: 0.8,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                trip.name,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  height: 1.15,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  if (trip.isActive)
                    const StatusPill(
                      label: 'Open departure',
                      color: AppColors.warning,
                      filled: false,
                    ),
                  const Spacer(),
                  Text(
                    TripFormatters.durationLabel(trip.durationDays),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'All-Inclusive',
                        style: TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                      Text(
                        'See dates',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  FilledButton(
                    onPressed: onViewTrip,
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.terracotta,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(22),
                      ),
                    ),
                    child: const Text('View Trip  →'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
