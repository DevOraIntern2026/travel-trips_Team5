import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/trip.dart';
import '../cubit/trip_browsing_cubit.dart';
import '../cubit/trip_request_status.dart';
import '../cubit/trip_search_cubit.dart';
import '../widgets/app_header.dart';
import '../widgets/listing_trip_card.dart';
import 'filter_page.dart';
import 'trip_details_page.dart';

class TripResultsPage extends StatelessWidget {
  const TripResultsPage({
    super.key,
    required this.title,
    this.initialQuery,
    this.initialFilters,
    this.destinationId,
  });

  final String title;
  final String? initialQuery;
  final TripFilterCriteria? initialFilters;
  final int? destinationId;

  @override
  Widget build(BuildContext context) {
    final query = initialQuery?.trim();
    if (query != null && query.isNotEmpty && initialFilters == null) {
      return BlocProvider(
        create: (_) => getIt<TripSearchCubit>()..search(query),
        child: _SearchResultsView(title: title, query: query),
      );
    }

    return BlocProvider(
      create: (_) {
        final cubit = getIt<TripBrowsingCubit>();
        final filters = initialFilters;
        if (filters != null && filters.visibleCount > 0) {
          cubit.applyFilters(
            destinationId: filters.destinationId,
            destinationLabel: filters.destinationLabel,
            date: filters.date,
            dateLabel: filters.dateLabel,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minDuration: filters.minDuration,
            maxDuration: filters.maxDuration,
            availableOnly: filters.availableOnly,
            hideSoldOut: filters.hideSoldOut,
            limit: 20,
          );
        } else {
          cubit.loadTrips(
            limit: 20,
            search: query,
            destinationId: destinationId,
            sort: 'date_asc',
          );
        }
        return cubit;
      },
      child: _BrowseResultsView(
        title: title,
        initialFilters: initialFilters,
      ),
    );
  }
}

class _SearchResultsView extends StatelessWidget {
  const _SearchResultsView({required this.title, required this.query});

  final String title;
  final String query;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TripSearchCubit, TripSearchState>(
      builder: (context, state) {
        return _ResultsScaffold(
          title: title,
          chips: [title],
          total: state.total,
          status: state.status,
          trips: state.trips,
          failureMessage: state.failure?.message,
          onRetry: () => context.read<TripSearchCubit>().search(query),
          onFilter: () async {
            final result = await Navigator.of(context).push<TripFilterCriteria>(
              MaterialPageRoute(builder: (_) => const FilterPage()),
            );
            if (!context.mounted || result == null) return;
            await Navigator.of(context).pushReplacement(
              MaterialPageRoute<void>(
                builder: (_) => TripResultsPage(
                  title: 'Filtered trips',
                  initialFilters: result,
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class _BrowseResultsView extends StatelessWidget {
  const _BrowseResultsView({required this.title, this.initialFilters});

  final String title;
  final TripFilterCriteria? initialFilters;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TripBrowsingCubit, TripBrowsingState>(
      builder: (context, state) {
        final filters = state.filters ?? initialFilters;
        final trips = (filters?.hideSoldOut == true)
            ? state.trips.where((trip) => trip.isActive).toList()
            : state.trips;
        return _ResultsScaffold(
          title: title,
          chips: filters?.chipLabels ?? [title],
          total: state.total,
          status: state.status,
          trips: trips,
          failureMessage: state.failure?.message,
          filterCount: filters?.visibleCount ?? 0,
          onRetry: () {
            final current = state.filters;
            if (current == null) {
              context.read<TripBrowsingCubit>().loadTrips(limit: 20, sort: 'date_asc');
              return;
            }
            context.read<TripBrowsingCubit>().applyFilters(
                  destinationId: current.destinationId,
                  destinationLabel: current.destinationLabel,
                  date: current.date,
                  dateLabel: current.dateLabel,
                  minPrice: current.minPrice,
                  maxPrice: current.maxPrice,
                  minDuration: current.minDuration,
                  maxDuration: current.maxDuration,
                  availableOnly: current.availableOnly,
                  hideSoldOut: current.hideSoldOut,
                  limit: 20,
                );
          },
          onFilter: () async {
            final result = await Navigator.of(context).push<TripFilterCriteria>(
              MaterialPageRoute(
                builder: (_) => FilterPage(initialFilters: filters),
              ),
            );
            if (!context.mounted || result == null) return;
            if (result.visibleCount == 0) {
              await context.read<TripBrowsingCubit>().loadTrips(limit: 20);
              return;
            }
            await context.read<TripBrowsingCubit>().applyFilters(
                  destinationId: result.destinationId,
                  destinationLabel: result.destinationLabel,
                  date: result.date,
                  dateLabel: result.dateLabel,
                  minPrice: result.minPrice,
                  maxPrice: result.maxPrice,
                  minDuration: result.minDuration,
                  maxDuration: result.maxDuration,
                  availableOnly: result.availableOnly,
                  hideSoldOut: result.hideSoldOut,
                  limit: 20,
                );
          },
        );
      },
    );
  }
}

class _ResultsScaffold extends StatelessWidget {
  const _ResultsScaffold({
    required this.title,
    required this.chips,
    required this.total,
    required this.status,
    required this.trips,
    required this.onRetry,
    required this.onFilter,
    this.failureMessage,
    this.filterCount = 0,
  });

  final String title;
  final List<String> chips;
  final int total;
  final TripRequestStatus status;
  final List<Trip> trips;
  final String? failureMessage;
  final VoidCallback onRetry;
  final VoidCallback onFilter;
  final int filterCount;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          AppHeader(onBellTap: () {}, onProfileTap: () {}),
          Padding(
            padding: const EdgeInsets.fromLTRB(8, 4, 16, 8),
            child: Row(
              children: [
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.arrow_back_ios_new, size: 18),
                ),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 20,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
          ),
          if (chips.isNotEmpty)
            SizedBox(
              height: 38,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemBuilder: (context, index) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    decoration: BoxDecoration(
                      color: AppColors.forestSoft,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        Text(
                          chips[index],
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.close, size: 14),
                      ],
                    ),
                  );
                },
                separatorBuilder: (context, index) => const SizedBox(width: 8),
                itemCount: chips.length,
              ),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Row(
              children: [
                Text(
                  'Showing  ',
                  style: TextStyle(color: AppColors.muted, fontSize: 13),
                ),
                Text(
                  '$total verified trips',
                  style: const TextStyle(
                    color: AppColors.forestMid,
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                  ),
                ),
                const Spacer(),
                const Text(
                  'Sort: Earliest Date',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
          Expanded(child: _body()),
        ],
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton.icon(
              onPressed: onFilter,
              icon: const Icon(Icons.tune, size: 18),
              label: Text(filterCount > 0 ? 'Filters ($filterCount)' : 'Filters'),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.forest,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
            const SizedBox(width: 8),
            FilledButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Map view is coming soon.')),
                );
              },
              icon: const Icon(Icons.map_outlined, size: 18),
              label: const Text('Map View'),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.forest,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _body() {
    if (status == TripRequestStatus.loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (status == TripRequestStatus.failure) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(failureMessage ?? 'Trips could not be loaded.'),
            const SizedBox(height: 8),
            OutlinedButton(onPressed: onRetry, child: const Text('Try again')),
          ],
        ),
      );
    }
    if (trips.isEmpty) {
      return const Center(child: Text('No trips found for these filters.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 96),
      itemCount: trips.length,
      itemBuilder: (context, index) {
        final trip = trips[index];
        return ListingTripCard(
          trip: trip,
          onTap: () => Navigator.of(context, rootNavigator: true).push(
            MaterialPageRoute<void>(
              builder: (_) => TripDetailsPage(tripId: trip.id),
            ),
          ),
        );
      },
    );
  }
}
