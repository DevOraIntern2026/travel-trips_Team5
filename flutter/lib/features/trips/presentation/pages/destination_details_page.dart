import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/destination.dart';
import '../../domain/entities/trip.dart';
import '../cubit/trip_browsing_cubit.dart';
import '../cubit/trip_request_status.dart';
import '../utils/trip_formatters.dart';
import '../utils/trip_image_resolver.dart';
import '../widgets/media_placeholder.dart';

class DestinationDetailsPage extends StatelessWidget {
  const DestinationDetailsPage({super.key, required this.destination});

  final Destination destination;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) =>
          getIt<TripBrowsingCubit>()
            ..loadTrips(limit: 20, destinationId: destination.id),
      child: _DestinationView(destination: destination),
    );
  }
}

class _DestinationView extends StatelessWidget {
  const _DestinationView({required this.destination});

  final Destination destination;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: BlocBuilder<TripBrowsingCubit, TripBrowsingState>(
        builder: (context, state) {
          final trips = state.trips;
          return Column(
            children: [
              Expanded(
                child: CustomScrollView(
                  slivers: [
                    SliverToBoxAdapter(
                      child: Stack(
                        children: [
                          MediaPlaceholder(
                            seed: destination.id + 11,
                            imageAsset: TripImageResolver.forDestination(
                              destination,
                            ),
                            height: 220,
                            borderRadius: BorderRadius.zero,
                            overlay: LinearGradient(
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                              colors: [
                                Colors.black.withValues(alpha: 0.55),
                                Colors.transparent,
                              ],
                            ),
                          ),
                          SafeArea(
                            child: Padding(
                              padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
                              child: Row(
                                children: [
                                  _circleButton(
                                    Icons.arrow_back,
                                    () => context.pop(),
                                  ),
                                  const Spacer(),
                                  const Text(
                                    'Trip Detail',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const Spacer(),
                                  _circleButton(
                                    Icons.ios_share_outlined,
                                    () {},
                                  ),
                                  const SizedBox(width: 8),
                                  _circleButton(Icons.favorite_border, () {}),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${destination.city}  Ãƒâ€šÃ‚Â·  ${destination.country}',
                              style: const TextStyle(
                                color: AppColors.muted,
                                fontSize: 12,
                                letterSpacing: 0.4,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              destination.name,
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.w800,
                                height: 1.15,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Wrap(
                              spacing: 8,
                              children: [
                                _metaChip('Region', destination.country),
                                _metaChip('City', destination.city),
                                _metaChip(
                                  'Status',
                                  destination.isActive ? 'Open' : 'Closed',
                                ),
                              ],
                            ),
                            const SizedBox(height: 22),
                            const Text(
                              'Overview & Terrain',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 18,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              destination.description?.trim().isNotEmpty == true
                                  ? destination.description!
                                  : 'Curated high-country routes around ${destination.city}, with seasonal windows and confirmed small-group departures.',
                              style: const TextStyle(
                                color: AppColors.muted,
                                height: 1.5,
                              ),
                            ),
                            const SizedBox(height: 14),
                            Row(
                              children: [
                                Expanded(
                                  child: MediaPlaceholder(
                                    seed: destination.id,
                                    height: 88,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: MediaPlaceholder(
                                    seed: destination.id + 2,
                                    height: 88,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: MediaPlaceholder(
                                    seed: destination.id + 4,
                                    height: 88,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 22),
                            const Text(
                              'Seasonal Conditions',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 18,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                Expanded(
                                  child: _conditionCard(
                                    'Cleared',
                                    'High routes generally open in season.',
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: _conditionCard(
                                    'Optimal',
                                    'Best high-plateau stability window.',
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 22),
                            Row(
                              children: [
                                const Text(
                                  'Signature Expeditions',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 18,
                                  ),
                                ),
                                const Spacer(),
                                Text(
                                  'View all ${state.total}',
                                  style: const TextStyle(
                                    color: AppColors.forestMid,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            if (state.status == TripRequestStatus.loading)
                              const Padding(
                                padding: EdgeInsets.all(24),
                                child: Center(
                                  child: CircularProgressIndicator(),
                                ),
                              )
                            else
                              ...trips.map(_expeditionCard),
                            const SizedBox(height: 18),
                            const Text(
                              'Regional Logistics',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 18,
                              ),
                            ),
                            const SizedBox(height: 10),
                            _logisticsTile(
                              Icons.hub_outlined,
                              'Gateway Hub',
                              destination.city,
                            ),
                            const SizedBox(height: 8),
                            _logisticsTile(
                              Icons.rule_folder_outlined,
                              'Permits & Rifugio Rules',
                              'Confirm local access windows before departure.',
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SafeArea(
                top: false,
                child: Container(
                  padding: const EdgeInsets.fromLTRB(20, 12, 16, 12),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    border: Border(top: BorderSide(color: AppColors.border)),
                  ),
                  child: Row(
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Starting from',
                            style: TextStyle(
                              color: AppColors.muted,
                              fontSize: 12,
                            ),
                          ),
                          Text(
                            'See dates',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 22,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      FilledButton(
                        onPressed: trips.isEmpty
                            ? null
                            : () => _openTrip(context, trips.first),
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.forest,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 18,
                            vertical: 14,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(22),
                          ),
                        ),
                        child: Text('Explore ${trips.length} Expeditions'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _expeditionCard(Trip trip) {
    return Builder(
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () => _openTrip(context, trip),
            borderRadius: BorderRadius.circular(18),
            child: Row(
              children: [
                SizedBox(
                  width: 92,
                  height: 92,
                  child: MediaPlaceholder(
                    seed: trip.id,
                    height: 92,
                    borderRadius: BorderRadius.circular(16),
                    child: trip.isActive
                        ? null
                        : const Align(
                            alignment: Alignment.topLeft,
                            child: Padding(
                              padding: EdgeInsets.all(6),
                              child: StatusPill(
                                label: 'Waitlist',
                                color: AppColors.soldOut,
                              ),
                            ),
                          ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (trip.isActive)
                        const StatusPill(
                          label: 'Open',
                          color: AppColors.warning,
                          filled: false,
                        ),
                      const SizedBox(height: 6),
                      Text(
                        trip.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        TripFormatters.nightsLabel(trip.durationDays),
                        style: const TextStyle(
                          color: AppColors.muted,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right, color: AppColors.muted),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _metaChip(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.chip,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: const TextStyle(color: AppColors.muted, fontSize: 10),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _conditionCard(String title, String body) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(
            body,
            style: const TextStyle(color: AppColors.muted, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _logisticsTile(IconData icon, String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: AppColors.forestSoft,
            child: Icon(icon, color: AppColors.forest, size: 18),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(color: AppColors.muted, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _circleButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: CircleAvatar(
        backgroundColor: Colors.white,
        child: Icon(icon, color: AppColors.forest, size: 18),
      ),
    );
  }

  void _openTrip(BuildContext context, Trip trip) {
    context.push('/trips/${trip.id}');
  }
}
