import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../../core/widgets/flow_top_bar.dart';
import '../../../booking/presentation/widgets/edge_state_views/no_matches_view.dart';
import '../../../booking/presentation/widgets/booking_error_state.dart';
import '../../../booking/presentation/widgets/booking_loading_state.dart';

import '../../data/models/trip_model.dart';
import '../cubit/home_cubit.dart';
import '../cubit/home_state.dart';
import '../widgets/home_category_chip.dart';
import '../widgets/home_copilot_card.dart';
import '../widgets/home_guarantee_banner.dart';
import '../widgets/home_search_row.dart';
import '../widgets/home_staff_pick.dart';
import '../widgets/home_trending_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key, this.onOpenAlerts});
  final VoidCallback? onOpenAlerts;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<HomeCubit>()..getTrips(),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          bottom: false,
          child: Column(
            children: [
              FlowTopBar(
                title: 'TravelOra',
                showBack: false,
                showLogoTagline: true,
                actions: [
                  TopBarIcon(Icons.notifications_none, onTap: onOpenAlerts),
                ],
              ),
              const Expanded(child: _HomeBody()),
            ],
          ),
        ),
      ),
    );
  }
}

class _HomeBody extends StatefulWidget {
  const _HomeBody();

  @override
  State<_HomeBody> createState() => _HomeBodyState();
}

class _HomeBodyState extends State<_HomeBody> {
  final _searchController = TextEditingController();
  Timer? _searchDebounce;
  String _query = '';
  String? _curation;
  bool _availableOnly = false;
  double? _minPrice;
  double? _maxPrice;

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  void _resetFilters() {
    _searchDebounce?.cancel();
    setState(() {
      _query = '';
      _curation = null;
      _availableOnly = false;
      _minPrice = null;
      _maxPrice = null;
      _searchController.clear();
    });
    context.read<HomeCubit>().getTrips();
  }

  void _onSearchChanged(String value) {
    setState(() {
      _query = value;
      _curation = null;
      _availableOnly = false;
      _minPrice = null;
      _maxPrice = null;
    });
    _searchDebounce?.cancel();
    _searchDebounce = Timer(const Duration(milliseconds: 350), () {
      if (!mounted) return;
      final query = _query.trim();
      if (query.isEmpty) {
        context.read<HomeCubit>().getTrips();
      } else {
        context.read<HomeCubit>().searchTrips(query);
      }
    });
  }

  Future<void> _showFilters() async {
    final minController = TextEditingController(
      text: _minPrice?.toString() ?? '',
    );
    final maxController = TextEditingController(
      text: _maxPrice?.toString() ?? '',
    );
    var availableOnly = _availableOnly;
    String? validationMessage;

    final selection = await showDialog<_TripFilterSelection>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Filter trips'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: minController,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: const InputDecoration(labelText: 'Minimum price'),
              ),
              TextField(
                controller: maxController,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                ),
                decoration: const InputDecoration(labelText: 'Maximum price'),
              ),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Only trips with available dates'),
                value: availableOnly,
                onChanged: (value) => setDialogState(() {
                  availableOnly = value;
                }),
              ),
              if (validationMessage != null)
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    validationMessage!,
                    style: const TextStyle(color: AppColors.error),
                  ),
                ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                final minText = minController.text.trim();
                final maxText = maxController.text.trim();
                final min = minText.isEmpty ? null : double.tryParse(minText);
                final max = maxText.isEmpty ? null : double.tryParse(maxText);
                if ((minText.isNotEmpty && min == null) ||
                    (maxText.isNotEmpty && max == null) ||
                    (min != null && max != null && min > max)) {
                  setDialogState(() {
                    validationMessage =
                        'Enter valid prices; minimum must not exceed maximum.';
                  });
                  return;
                }
                Navigator.pop(
                  dialogContext,
                  _TripFilterSelection(
                    minPrice: min,
                    maxPrice: max,
                    availableOnly: availableOnly,
                  ),
                );
              },
              child: const Text('Apply'),
            ),
          ],
        ),
      ),
    );
    minController.dispose();
    maxController.dispose();
    if (!mounted || selection == null) return;

    _searchDebounce?.cancel();
    setState(() {
      _query = '';
      _curation = null;
      _searchController.clear();
      _minPrice = selection.minPrice;
      _maxPrice = selection.maxPrice;
      _availableOnly = selection.availableOnly;
    });
    context.read<HomeCubit>().filterTrips(
      minPrice: selection.minPrice,
      maxPrice: selection.maxPrice,
      availableOnly: selection.availableOnly ? true : null,
    );
  }

  void _openTrip(TripModel trip) {
    context.push('/trips/${trip.id}');
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeCubit, HomeState>(
      builder: (context, state) {
        if (state is HomeLoading || state is HomeInitial) {
          return const BookingLoadingState(
            message:
                'Loading',
          );
        }

        if (state is HomeError) {
          return BookingErrorState(message: state.message, onRetry: _reload);
        }

        final all = (state as HomeSuccess).trips;
        final filtered = all;

        return RefreshIndicator(
          onRefresh: _reload,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
            children: [
              HomeSearchRow(
                controller: _searchController,
                onChanged: _onSearchChanged,
                onFilter: _showFilters,
              ),
              const SizedBox(height: 16),
              const HomeCopilotCard(),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: Text('Explore Curations', style: AppText.label(15)),
                  ),
                  Text('Real-time sync', style: AppText.mono(11.5)),
                ],
              ),
              const SizedBox(height: 10),
              SizedBox(
                height: 40,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    HomeCategoryChip(
                      label: 'All Trips (${all.length})',
                      selected:
                          _curation == null &&
                          !_availableOnly &&
                          _minPrice == null &&
                          _maxPrice == null,
                      onTap: _resetFilters,
                    ),
                    HomeCategoryChip(
                      label: 'Alpine & Trekking',
                      selected: _curation == 'Alpine & Trekking',
                      onTap: () =>
                          _searchCuration('Alpine & Trekking', 'Alpine'),
                    ),
                    HomeCategoryChip(
                      label: 'Coastal & Islands',
                      selected: _curation == 'Coastal & Islands',
                      onTap: () =>
                          _searchCuration('Coastal & Islands', 'Coastal'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              if (filtered.isEmpty)
                NoMatchesView(
                  filters: [
                    if (_query.trim().isNotEmpty) _query.trim(),
                    if (_availableOnly) 'Available dates',
                    if (_minPrice != null)
                      'From ${_minPrice!.toStringAsFixed(0)}',
                    if (_maxPrice != null)
                      'Up to ${_maxPrice!.toStringAsFixed(0)}',
                  ],
                  onReset: _resetFilters,
                )
              else ...[
                HomeStaffPick(trip: _featured(filtered), onTap: _openTrip),
                if (filtered.length > 1) ...[
                  const SizedBox(height: 22),
                  SectionTitle(
                    'Trending Handpicked Routes',
                    icon: Icons.trending_up,
                    trailing: Text(
                      'See all',
                      style: AppText.label(13, AppColors.primary),
                    ),
                  ),
                  const SizedBox(height: 12),
                  for (final t in filtered.where(
                    (t) => t != _featured(filtered),
                  ))
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: HomeTrendingCard(trip: t, onTap: _openTrip),
                    ),
                ],
              ],
              const SizedBox(height: 10),
              const HomeGuaranteeBanner(),
            ],
          ),
        );
      },
    );
  }

  TripModel _featured(List<TripModel> trips) {
    final rated = trips.where((t) => t.rating != null).toList()
      ..sort((a, b) => b.rating!.compareTo(a.rating!));
    return rated.isNotEmpty ? rated.first : trips.first;
  }

  void _searchCuration(String label, String query) {
    _searchDebounce?.cancel();
    setState(() {
      _curation = label;
      _query = query;
      _searchController.clear();
      _availableOnly = false;
      _minPrice = null;
      _maxPrice = null;
    });
    context.read<HomeCubit>().searchTrips(query);
  }

  Future<void> _reload() {
    final query = _query.trim();
    if (query.isNotEmpty) return context.read<HomeCubit>().searchTrips(query);
    if (_availableOnly || _minPrice != null || _maxPrice != null) {
      return context.read<HomeCubit>().filterTrips(
        minPrice: _minPrice,
        maxPrice: _maxPrice,
        availableOnly: _availableOnly ? true : null,
      );
    }
    return context.read<HomeCubit>().getTrips();
  }
}

class _TripFilterSelection {
  const _TripFilterSelection({
    this.minPrice,
    this.maxPrice,
    required this.availableOnly,
  });

  final double? minPrice;
  final double? maxPrice;
  final bool availableOnly;
}
