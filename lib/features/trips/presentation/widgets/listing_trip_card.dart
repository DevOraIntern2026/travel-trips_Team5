import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/trip.dart';
import '../utils/trip_formatters.dart';
import 'media_placeholder.dart';

class ListingTripCard extends StatelessWidget {
  const ListingTripCard({super.key, required this.trip, required this.onTap});

  final Trip trip;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final soldOut = !trip.isActive;
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: onTap,
            child: MediaPlaceholder(
              seed: trip.id,
              height: 168,
              overlay: soldOut
                  ? LinearGradient(
                      colors: [
                        Colors.black.withValues(alpha: 0.28),
                        Colors.black.withValues(alpha: 0.28),
                      ],
                    )
                  : LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Colors.black.withValues(alpha: 0.35),
                        Colors.transparent,
                      ],
                    ),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  children: [
                    Row(
                      children: [
                        StatusPill(
                          label: soldOut
                              ? 'Sold Out'
                              : trip.isActive
                                  ? 'Upcoming Departure'
                                  : 'Unavailable',
                          color: soldOut ? AppColors.soldOut : AppColors.success,
                        ),
                        const SizedBox(width: 6),
                        StatusPill(
                          label: soldOut ? 'Full Capacity' : 'Seats Open',
                          color: soldOut ? AppColors.soldOut : AppColors.warning,
                        ),
                        const Spacer(),
                        const CircleAvatar(
                          radius: 14,
                          backgroundColor: Colors.white,
                          child: Icon(
                            Icons.bookmark_border,
                            size: 16,
                            color: AppColors.forest,
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        Text(
                          'DURATION  ${TripFormatters.durationLabel(trip.durationDays)}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.4,
                          ),
                        ),
                        const Spacer(),
                        const Icon(Icons.star, color: Colors.white, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          trip.isActive ? 'Verified' : 'Waitlist',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            trip.name,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${TripFormatters.location(trip)}  ·  ${trip.durationDays} Days / ${trip.durationDays > 1 ? trip.durationDays - 1 : trip.durationDays} Nights',
            style: const TextStyle(color: AppColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    soldOut ? 'All spots reserved' : 'STARTING FROM',
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    soldOut ? 'Waitlist' : 'See dates',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              FilledButton(
                onPressed: onTap,
                style: FilledButton.styleFrom(
                  backgroundColor: soldOut ? AppColors.chip : AppColors.terracotta,
                  foregroundColor: soldOut ? AppColors.ink : Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(22),
                  ),
                ),
                child: Text(soldOut ? 'Join Waitlist' : 'View Seats  →'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
