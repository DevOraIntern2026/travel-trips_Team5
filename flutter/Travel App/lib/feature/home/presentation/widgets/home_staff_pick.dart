import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/currency_format.dart';
import '../../../../core/utils/date_format.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../data/models/trip_model.dart';

class HomeStaffPick extends StatelessWidget {
  const HomeStaffPick({super.key, required this.trip, required this.onTap});

  final TripModel trip;
  final ValueChanged<TripModel> onTap;

  @override
  Widget build(BuildContext context) {
    final metaParts = <String>[
      if (trip.durationDays != null) '${trip.durationDays} DAYS',
      if (trip.location != null) trip.location!.toUpperCase(),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionTitle(
          'Staff Pick of the Week',
          icon: Icons.stars,
          trailing: trip.rating == null
              ? null
              : Text(
                  'Top Rated ${trip.rating!.toStringAsFixed(2)}',
                  style: AppText.mono(11.5),
                ),
        ),
        const SizedBox(height: 12),
        InkWell(
          onTap: () => onTap(trip),
          borderRadius: BorderRadius.circular(22),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              children: [
                TripImage(
                  url: trip.imageUrl,
                  height: 200,
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
                      if (trip.confirmed)
                        const Positioned(
                          top: 12,
                          left: 12,
                          child: AppPill(
                            'Confirmed Departure',
                            background: AppColors.mint,
                            foreground: AppColors.success,
                            icon: Icons.check_circle,
                          ),
                        ),
                      Positioned(
                        top: 12,
                        right: 12,
                        child: Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(80),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.favorite_border,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                      Positioned(
                        left: 14,
                        right: 14,
                        bottom: 14,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (metaParts.isNotEmpty)
                              Text(
                                metaParts.join(' • '),
                                style: AppText.mono(
                                  11,
                                  Colors.white.withAlpha(210),
                                ),
                              ),
                            const SizedBox(height: 4),
                            Text(
                              trip.title,
                              style: AppText.title(22, Colors.white),
                            ),
                          ],
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
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (trip.seatsLeft != null)
                            AppPill(
                              'Only ${trip.seatsLeft} seats left',
                              background: AppColors.warnSurface,
                              foreground: AppColors.warn,
                              dot: true,
                            )
                          else
                            const SizedBox.shrink(),
                          if (trip.nextDeparture != null)
                            Row(
                              children: [
                                const Icon(
                                  Icons.calendar_today_outlined,
                                  size: 15,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  _prettyDate(trip.nextDeparture!),
                                  style: AppText.body(13),
                                ),
                              ],
                            ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                if (trip.price != null) ...[
                                  Text(
                                    'All-inclusive',
                                    style: AppText.mono(11.5),
                                  ),
                                  const SizedBox(height: 2),
                                  Text.rich(
                                    TextSpan(
                                      children: [
                                        TextSpan(
                                          text: formatMoney(trip.price!),
                                          style: AppText.title(24),
                                        ),
                                        TextSpan(
                                          text: ' /person',
                                          style: AppText.body(
                                            12.5,
                                            AppColors.muted,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                          FilledButton(
                            onPressed: () => onTap(trip),
                            style: FilledButton.styleFrom(
                              backgroundColor: AppColors.rust,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 22,
                                vertical: 16,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'View Trip',
                                  style: AppText.label(15, Colors.white),
                                ),
                                const SizedBox(width: 6),
                                const Icon(Icons.arrow_forward, size: 18),
                              ],
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
        ),
      ],
    );
  }

  String _prettyDate(String iso) {
    final d = DateTime.tryParse(iso);
    return d == null ? iso : formatDate(d);
  }
}
