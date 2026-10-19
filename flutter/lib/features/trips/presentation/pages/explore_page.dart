import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/router/app_router.dart' show TripResultsRouteData;
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/trip.dart';
import '../cubit/trip_browsing_cubit.dart';
import '../cubit/trip_request_status.dart';
import '../widgets/app_header.dart';
import '../widgets/featured_trip_card.dart';
import '../widgets/media_placeholder.dart';
import '../widgets/trending_trip_tile.dart';

class ExplorePage extends StatelessWidget {
  const ExplorePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<TripBrowsingCubit>()..loadTrips(limit: 20),
      child: const _ExploreView(),
    );
  }
}

class _ExploreView extends StatefulWidget {
  const _ExploreView();

  @override
  State<_ExploreView> createState() => _ExploreViewState();
}

class _ExploreViewState extends State<_ExploreView> {
  final _searchController = TextEditingController();
  int _curation = 0;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          AppHeader(
            onBellTap: () => context.go('/alerts'),
            onProfileTap: () => context.go('/profile'),
          ),
          Expanded(
            child: BlocBuilder<TripBrowsingCubit, TripBrowsingState>(
              builder: (context, state) {
                final trips = state.trips;
                final staffPick = trips.isEmpty ? null : trips.first;
                final trending = trips.length > 1
                    ? trips.skip(1).take(3).toList()
                    : <Trip>[];

                return RefreshIndicator(
                  onRefresh: () =>
                      context.read<TripBrowsingCubit>().loadTrips(limit: 20),
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 28),
                    children: [
                      _SearchBar(
                        controller: _searchController,
                        onSearch: _openSearch,
                        onFilter: _openFilters,
                      ),
                      const SizedBox(height: 14),
                      const _CopilotBanner(),
                      const SizedBox(height: 22),
                      Row(
                        children: [
                          const Text(
                            'Explore Curations',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 18,
                            ),
                          ),
                          const Spacer(),
                          const Icon(
                            Icons.sync,
                            size: 14,
                            color: AppColors.success,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Real-time sync',
                            style: TextStyle(
                              color: AppColors.success.withValues(alpha: 0.9),
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            ForestChip(
                              label: 'All Trips (${state.total})',
                              selected: _curation == 0,
                              onTap: () {
                                setState(() => _curation = 0);
                                _openResults(title: 'All Expeditions');
                              },
                            ),
                            const SizedBox(width: 8),
                            ForestChip(
                              label: 'Alpine & Trekking',
                              selected: _curation == 1,
                              onTap: () {
                                setState(() => _curation = 1);
                                _openResults(title: 'Alpine & Mountain Treks');
                              },
                            ),
                            const SizedBox(width: 8),
                            ForestChip(
                              label: 'Coastal & Islands',
                              selected: _curation == 2,
                              onTap: () {
                                setState(() => _curation = 2);
                                _openResults(title: 'Coastal & Islands');
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 22),
                      if (state.status == TripRequestStatus.loading &&
                          trips.isEmpty)
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 48),
                          child: Center(child: CircularProgressIndicator()),
                        )
                      else if (state.status == TripRequestStatus.failure &&
                          trips.isEmpty)
                        _ErrorState(
                          message:
                              state.failure?.message ??
                              'Trips could not be loaded.',
                          onRetry: () => context
                              .read<TripBrowsingCubit>()
                              .loadTrips(limit: 20),
                        )
                      else ...[
                        Row(
                          children: [
                            const Text(
                              'Staff Pick of the Week',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 18,
                              ),
                            ),
                            const Spacer(),
                            const Icon(
                              Icons.star,
                              size: 14,
                              color: AppColors.warning,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Top Rated',
                              style: TextStyle(
                                color: AppColors.muted,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        if (staffPick != null)
                          FeaturedTripCard(
                            trip: staffPick,
                            onViewTrip: () => _openTrip(staffPick),
                            onOpenDestination: staffPick.destination == null
                                ? null
                                : () => _openDestination(staffPick),
                          ),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            const Icon(Icons.trending_up, size: 18),
                            const SizedBox(width: 6),
                            const Text(
                              'Trending Handpicked Routes',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 16,
                              ),
                            ),
                            const Spacer(),
                            TextButton(
                              onPressed: () =>
                                  _openResults(title: 'All Expeditions'),
                              child: const Text(
                                'See all >',
                                style: TextStyle(
                                  color: AppColors.forestMid,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                        ...trending.map(
                          (trip) => TrendingTripTile(
                            trip: trip,
                            onTap: () => _openTrip(trip),
                          ),
                        ),
                        const SizedBox(height: 16),
                        const _GuaranteeBanner(),
                      ],
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _openSearch(String query) {
    final normalized = query.trim();
    if (normalized.isEmpty) return;
    context.push(
      '/trips/results',
      extra: TripResultsRouteData(title: normalized, query: normalized),
    );
  }

  void _openResults({required String title, String? query}) {
    context.push(
      '/trips/results',
      extra: TripResultsRouteData(title: title, query: query),
    );
  }

  Future<void> _openFilters() async {
    final result = await context.push<TripFilterCriteria>('/trips/filter');
    if (!mounted || result == null || result.visibleCount == 0) return;
    await context.push(
      '/trips/results',
      extra: TripResultsRouteData(title: 'Filtered trips', filters: result),
    );
  }

  void _openTrip(Trip trip) {
    context.push('/trips/${trip.id}');
  }

  void _openDestination(Trip trip) {
    final destination = trip.destination;
    if (destination == null) return;
    context.push('/destinations/${destination.id}', extra: destination);
  }
}

class _SearchBar extends StatelessWidget {
  const _SearchBar({
    required this.controller,
    required this.onSearch,
    required this.onFilter,
  });

  final TextEditingController controller;
  final ValueChanged<String> onSearch;
  final VoidCallback onFilter;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.border),
            ),
            child: TextField(
              controller: controller,
              textInputAction: TextInputAction.search,
              onSubmitted: onSearch,
              decoration: const InputDecoration(
                hintText: 'Where to next? (e.g. Dolomites, Kyoto)',
                hintStyle: TextStyle(fontSize: 13, color: AppColors.muted),
                prefixIcon: Icon(Icons.search, color: AppColors.muted),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                filled: false,
                contentPadding: EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        InkWell(
          onTap: onFilter,
          borderRadius: BorderRadius.circular(14),
          child: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.forest,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.tune, color: Colors.white),
          ),
        ),
      ],
    );
  }
}

class _CopilotBanner extends StatelessWidget {
  const _CopilotBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0C332C), Color(0xFF16493F)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: Colors.white70, size: 16),
              const SizedBox(width: 6),
              const Text(
                'TRAVELORA  AI  COPILOT',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 11,
                  letterSpacing: 1,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const Spacer(),
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.chat_bubble_outline,
                  color: Colors.white,
                  size: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Need trip inspiration based on your dates?',
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              height: 1.2,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Ask our assistant for curated routes with guaranteed open seats.',
            style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: const [
              _GhostChip(icon: Icons.terrain, label: 'Alpine Trekking'),
              _GhostChip(icon: Icons.sailing_outlined, label: 'Coastal Escape'),
            ],
          ),
          const SizedBox(height: 14),
          FilledButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Assistant is coming soon.')),
              );
            },
            style: FilledButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.forest,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(22),
              ),
            ),
            child: const Text('Chat with Assistant'),
          ),
        ],
      ),
    );
  }
}

class _GhostChip extends StatelessWidget {
  const _GhostChip({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white24),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.white),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
        ],
      ),
    );
  }
}

class _GuaranteeBanner extends StatelessWidget {
  const _GuaranteeBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.forestSoft,
        borderRadius: BorderRadius.circular(18),
      ),
      child: const Row(
        children: [
          CircleAvatar(
            backgroundColor: AppColors.forest,
            child: Icon(
              Icons.verified_user_outlined,
              color: Colors.white,
              size: 18,
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '100% Real-Time Seat Guarantee',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                SizedBox(height: 2),
                Text(
                  'Booked seats sync live to transport carriers with zero overbooking.',
                  style: TextStyle(
                    color: AppColors.muted,
                    fontSize: 12,
                    height: 1.35,
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

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 32),
      child: Column(
        children: [
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 12),
          OutlinedButton(onPressed: onRetry, child: const Text('Try again')),
        ],
      ),
    );
  }
}
