import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/destination.dart';
import '../cubit/trip_browsing_cubit.dart';
import '../cubit/trip_destinations_cubit.dart';
import '../cubit/trip_request_status.dart';
import '../utils/trip_formatters.dart';
import '../widgets/app_header.dart';
import '../widgets/media_placeholder.dart';

class FilterPage extends StatefulWidget {
  const FilterPage({super.key, this.initialFilters});

  final TripFilterCriteria? initialFilters;

  @override
  State<FilterPage> createState() => _FilterPageState();
}

class _FilterPageState extends State<FilterPage> {
  final _searchController = TextEditingController();
  int? _selectedDestinationId;
  String? _selectedDestinationLabel;
  String? _datePreset;
  DateTime? _rangeStart;
  DateTime? _rangeEnd;
  RangeValues _price = const RangeValues(400, 2000);
  bool _guaranteedOnly = true;
  bool _hideSoldOut = true;

  @override
  void initState() {
    super.initState();
    final filters = widget.initialFilters;
    _selectedDestinationId = filters?.destinationId;
    _selectedDestinationLabel = filters?.destinationLabel;
    _datePreset = filters?.dateLabel;
    if (filters?.minPrice != null || filters?.maxPrice != null) {
      _price = RangeValues(
        (filters?.minPrice ?? 400).toDouble().clamp(400, 2000),
        (filters?.maxPrice ?? 2000).toDouble().clamp(400, 2000),
      );
    }
    _guaranteedOnly = filters?.availableOnly ?? false;
    _hideSoldOut = filters?.hideSoldOut ?? false;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  DateTime get _now => DateTime.now();

  List<_DateOption> get _dateOptions {
    final now = _now;
    final thisMonth = DateTime(now.year, now.month);
    final nextMonth = DateTime(now.year, now.month + 1);
    return [
      const _DateOption(id: 'anytime', label: 'Anytime'),
      _DateOption(
        id: '30',
        label: 'Next 30 Days',
        start: now,
        end: now.add(const Duration(days: 30)),
      ),
      _DateOption(
        id: 'this',
        label: TripFormatters.monthYear(thisMonth),
        start: thisMonth,
        end: DateTime(thisMonth.year, thisMonth.month + 1, 0),
      ),
      _DateOption(
        id: 'next',
        label: TripFormatters.monthYear(nextMonth),
        start: nextMonth,
        end: DateTime(nextMonth.year, nextMonth.month + 1, 0),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<TripDestinationsCubit>()..load(),
      child: Builder(
        builder: (context) {
          return PopScope(
            canPop: false,
            onPopInvokedWithResult: (didPop, result) {
              if (didPop) return;
              _apply();
            },
            child: Scaffold(
              backgroundColor: Colors.white,
              body: Column(
                children: [
                  AppHeader(
                    onBellTap: () => context.go('/alerts'),
                    onProfileTap: () => context.go('/profile'),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(8, 4, 12, 8),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: _apply,
                          icon: const Icon(Icons.close),
                        ),
                        const Expanded(
                          child: Column(
                            children: [
                              Text(
                                'Filter Trips',
                                style: TextStyle(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 18,
                                ),
                              ),
                              Text(
                                'Explorer Parameters',
                                style: TextStyle(
                                  color: AppColors.forestMid,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        TextButton(
                          onPressed: _reset,
                          child: const Text(
                            'Reset All',
                            style: TextStyle(
                              color: AppColors.forest,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(20, 4, 20, 28),
                      children: [
                        _sectionTitle(
                          icon: Icons.public,
                          title: 'Destination & Region',
                          trailing: _selectedDestinationId == null
                              ? null
                              : '1 selected',
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _searchController,
                          onChanged: context
                              .read<TripDestinationsCubit>()
                              .search,
                          decoration: InputDecoration(
                            hintText: 'Select regions or countries',
                            prefixIcon: const Icon(
                              Icons.search,
                              color: AppColors.muted,
                            ),
                            filled: true,
                            fillColor: AppColors.cream,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide.none,
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        BlocBuilder<
                          TripDestinationsCubit,
                          TripDestinationsState
                        >(
                          builder: (context, state) {
                            if (state.status == TripRequestStatus.loading) {
                              return const Padding(
                                padding: EdgeInsets.all(16),
                                child: Center(
                                  child: CircularProgressIndicator(),
                                ),
                              );
                            }
                            final destinations = state.destinations
                                .take(8)
                                .toList();
                            return Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: destinations
                                  .map(
                                    (destination) => ForestChip(
                                      label: destination.name,
                                      selected:
                                          destination.id ==
                                          _selectedDestinationId,
                                      onTap: () =>
                                          _toggleDestination(destination),
                                    ),
                                  )
                                  .toList(),
                            );
                          },
                        ),
                        const SizedBox(height: 28),
                        _sectionTitle(
                          icon: Icons.calendar_month_outlined,
                          title: 'Departure Date Range',
                        ),
                        const SizedBox(height: 12),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: _dateOptions.map((option) {
                              final selected =
                                  (_datePreset ?? 'Anytime') == option.label;
                              return Padding(
                                padding: const EdgeInsets.only(right: 8),
                                child: ForestChip(
                                  label: option.label,
                                  selected: selected,
                                  onTap: () => setState(() {
                                    _datePreset = option.label;
                                    _rangeStart = option.start;
                                    _rangeEnd = option.end;
                                  }),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                        if (_rangeStart != null && _rangeEnd != null) ...[
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.forestSoft,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.calendar_today_outlined,
                                  color: AppColors.forest,
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Selected Range',
                                        style: TextStyle(
                                          color: AppColors.muted,
                                          fontSize: 12,
                                        ),
                                      ),
                                      Text(
                                        '${TripFormatters.monthDayYear(_rangeStart!)} – ${TripFormatters.monthDayYear(_rangeEnd!)}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                TextButton(
                                  onPressed: _editDates,
                                  child: const Text('Edit'),
                                ),
                              ],
                            ),
                          ),
                        ],
                        const SizedBox(height: 28),
                        Row(
                          children: [
                            const Icon(
                              Icons.payments_outlined,
                              color: AppColors.forest,
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'Price Range (USD)',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 16,
                              ),
                            ),
                            const Spacer(),
                            Text(
                              '${TripFormatters.money(_price.start)} – ${TripFormatters.money(_price.end)}+',
                              style: const TextStyle(
                                color: AppColors.muted,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        RangeSlider(
                          values: _price,
                          min: 400,
                          max: 2000,
                          divisions: 16,
                          activeColor: AppColors.forest,
                          onChanged: (value) => setState(() => _price = value),
                        ),
                        Row(
                          children: [
                            Expanded(child: _priceBox('Minimum', _price.start)),
                            const SizedBox(width: 12),
                            Expanded(child: _priceBox('Maximum', _price.end)),
                          ],
                        ),
                        const SizedBox(height: 28),
                        _sectionTitle(
                          icon: Icons.event_seat_outlined,
                          title: 'Seat Availability',
                        ),
                        const SizedBox(height: 12),
                        _toggleCard(
                          title: 'Guaranteed departures only',
                          subtitle: '≥ 1 confirmed open seat left',
                          value: _guaranteedOnly,
                          onChanged: (value) =>
                              setState(() => _guaranteedOnly = value),
                        ),
                        const SizedBox(height: 10),
                        _toggleCard(
                          title: 'Hide sold-out departures',
                          subtitle: 'Exclude waitlisted expeditions',
                          value: _hideSoldOut,
                          onChanged: (value) =>
                              setState(() => _hideSoldOut = value),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _sectionTitle({
    required IconData icon,
    required String title,
    String? trailing,
  }) {
    return Row(
      children: [
        Icon(icon, color: AppColors.forest),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
        ),
        const Spacer(),
        if (trailing != null)
          Text(
            trailing,
            style: const TextStyle(color: AppColors.muted, fontSize: 12),
          ),
      ],
    );
  }

  Widget _priceBox(String label, double value) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(color: AppColors.muted, fontSize: 12),
          ),
          const SizedBox(height: 4),
          Text(
            '${TripFormatters.money(value)} USD',
            style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
          ),
        ],
      ),
    );
  }

  Widget _toggleCard({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(color: AppColors.muted, fontSize: 12),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: Colors.white,
            activeTrackColor: AppColors.forest,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  void _toggleDestination(Destination destination) {
    setState(() {
      if (_selectedDestinationId == destination.id) {
        _selectedDestinationId = null;
        _selectedDestinationLabel = null;
      } else {
        _selectedDestinationId = destination.id;
        _selectedDestinationLabel = destination.name;
      }
    });
  }

  Future<void> _editDates() async {
    final selected = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
      initialDateRange: _rangeStart == null || _rangeEnd == null
          ? null
          : DateTimeRange(start: _rangeStart!, end: _rangeEnd!),
    );
    if (selected == null) return;
    setState(() {
      _rangeStart = selected.start;
      _rangeEnd = selected.end;
      _datePreset = 'Custom';
    });
  }

  void _reset() {
    _searchController.clear();
    setState(() {
      _selectedDestinationId = null;
      _selectedDestinationLabel = null;
      _datePreset = 'Anytime';
      _rangeStart = null;
      _rangeEnd = null;
      _price = const RangeValues(400, 2000);
      _guaranteedOnly = false;
      _hideSoldOut = false;
    });
  }

  void _apply() {
    final customPrice = _price.start > 400 || _price.end < 2000;
    Navigator.pop(
      context,
      TripFilterCriteria(
        destinationId: _selectedDestinationId,
        destinationLabel: _selectedDestinationLabel,
        date: _rangeStart == null ? null : TripFormatters.isoDate(_rangeStart!),
        dateLabel: _rangeStart == null
            ? null
            : (_datePreset ?? TripFormatters.monthYear(_rangeStart!)),
        minPrice: customPrice ? _price.start.round() : null,
        maxPrice: customPrice ? _price.end.round() : null,
        availableOnly: _guaranteedOnly || _hideSoldOut ? true : null,
        hideSoldOut: _hideSoldOut,
      ),
    );
  }
}

class _DateOption {
  const _DateOption({
    required this.id,
    required this.label,
    this.start,
    this.end,
  });

  final String id;
  final String label;
  final DateTime? start;
  final DateTime? end;
}
