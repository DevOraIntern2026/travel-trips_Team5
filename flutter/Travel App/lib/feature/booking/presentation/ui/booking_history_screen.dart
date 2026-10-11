import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../../core/widgets/flow_top_bar.dart';
import '../../data/models/booking_model.dart';
import '../../data/models/booking_status.dart';
import '../../data/models/trip_date_model.dart';
import '../cubit/booking_history_cubit.dart';
import '../cubit/booking_history_state.dart';
import '../widgets/booking_empty_state.dart';
import '../widgets/booking_error_state.dart';
import '../widgets/booking_history_card.dart';
import '../widgets/booking_loading_state.dart';
import 'booking_details_screen.dart';

/// "My Bookings" tab.
class BookingHistoryScreen extends StatelessWidget {
  const BookingHistoryScreen({super.key, this.onExplore});

  /// Called by "Explore Trips" in the promo card (switch to the Explore tab).
  final VoidCallback? onExplore;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<BookingHistoryCubit>()..getBookings(),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          bottom: false,
          child: Column(
            children: [
              const FlowTopBar(
                title: 'My Bookings',
                showBack: false,
                showLogoTagline: true,
                actions: [TopBarIcon(Icons.search)],
              ),
              Expanded(child: _Body(onExplore: onExplore)),
            ],
          ),
        ),
      ),
    );
  }
}

class _Body extends StatefulWidget {
  const _Body({this.onExplore});

  final VoidCallback? onExplore;

  @override
  State<_Body> createState() => _BodyState();
}

class _BodyState extends State<_Body> {
  bool _past = false;
  String? _status; // null = all

  bool _isPast(BookingModel b, Map<int, TripDateModel> dates) {
    if (BookingStatus.isCancelled(b.status)) return true;
    final d = dates[b.tripDateId];
    final end = d == null ? null : DateTime.tryParse(d.endDate);
    return end != null && end.isBefore(DateTime.now());
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BookingHistoryCubit, BookingHistoryState>(
      builder: (context, state) {
        if (state is BookingHistoryLoading || state is BookingHistoryInitial) {
          return const BookingLoadingState(message: 'Loading your bookings…');
        }

        if (state is BookingHistoryError) {
          return BookingErrorState(
            message: state.message,
            onRetry: () => context.read<BookingHistoryCubit>().getBookings(),
          );
        }

        final s = state as BookingHistorySuccess;
        final active = s.bookings
            .where((b) => !_isPast(b, s.tripDates))
            .toList();
        final past = s.bookings.where((b) => _isPast(b, s.tripDates)).toList();
        final source = _past ? past : active;
        final shown = source.where((b) {
          if (_status == null) return true;
          if (_status == BookingStatus.pending) {
            return !BookingStatus.isKnown(b.status);
          }
          return b.status == _status;
        }).toList();

        return RefreshIndicator(
          onRefresh: () => context.read<BookingHistoryCubit>().getBookings(),
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('My Bookings', style: AppText.title(31)),
                        const SizedBox(height: 2),
                        Text(
                          'Track live reservations and trip history',
                          style: AppText.body(
                            13.5,
                            AppColors.ink.withAlpha(200),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const AppPill(
                    'Live sync',
                    background: AppColors.infoSurface,
                    foreground: AppColors.ink,
                    dot: true,
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.infoSurface,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    _Tab(
                      label: 'Active & Upcoming',
                      count: active.length,
                      selected: !_past,
                      onTap: () => setState(() => _past = false),
                    ),
                    _Tab(
                      label: 'Past Trips',
                      count: past.length,
                      selected: _past,
                      onTap: () => setState(() => _past = true),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 38,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _Filter(
                      label: 'All Statuses',
                      icon: Icons.tune,
                      selected: _status == null,
                      onTap: () => setState(() => _status = null),
                    ),
                    _Filter(
                      label: BookingStatus.pending,
                      dot: AppColors.coral,
                      selected: _status == BookingStatus.pending,
                      onTap: () =>
                          setState(() => _status = BookingStatus.pending),
                    ),
                    _Filter(
                      label: BookingStatus.confirmed,
                      dot: AppColors.success,
                      selected: _status == BookingStatus.confirmed,
                      onTap: () =>
                          setState(() => _status = BookingStatus.confirmed),
                    ),
                    _Filter(
                      label: BookingStatus.cancelled,
                      dot: AppColors.error,
                      selected: _status == BookingStatus.cancelled,
                      onTap: () =>
                          setState(() => _status = BookingStatus.cancelled),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              if (shown.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: BookingEmptyState(
                    message: 'No bookings here yet',
                    hint: 'Your reservations will appear here.',
                    icon: Icons.luggage_outlined,
                  ),
                )
              else
                for (final b in shown)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 14),
                    child: BookingHistoryCard(
                      booking: b,
                      tripDate: s.tripDates[b.tripDateId],
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => BookingDetailsScreen(bookingId: b.id),
                        ),
                      ),
                    ),
                  ),
              _PromoCard(
                onExplore: widget.onExplore,
                onArchive: () => setState(() => _past = true),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Tab extends StatelessWidget {
  const _Tab({
    required this.label,
    required this.count,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          height: 42,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: selected ? Colors.white : null,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Flexible(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.label(
                    13.5,
                    AppColors.ink,
                    selected ? FontWeight.w800 : FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: selected ? AppColors.primary : AppColors.barOff,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$count',
                  style: AppText.label(
                    11,
                    selected ? Colors.white : AppColors.ink,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Filter extends StatelessWidget {
  const _Filter({
    required this.label,
    required this.selected,
    required this.onTap,
    this.icon,
    this.dot,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final IconData? icon;
  final Color? dot;

  @override
  Widget build(BuildContext context) {
    final fg = selected ? Colors.white : AppColors.ink;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: selected ? AppColors.primary : AppColors.infoSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            children: [
              if (icon != null) ...[
                Icon(icon, size: 16, color: fg),
                const SizedBox(width: 6),
              ],
              if (dot != null) ...[
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(color: dot, shape: BoxShape.circle),
                ),
                const SizedBox(width: 6),
              ],
              Text(label, style: AppText.label(13, fg, FontWeight.w600)),
            ],
          ),
        ),
      ),
    );
  }
}

class _PromoCard extends StatelessWidget {
  const _PromoCard({this.onExplore, required this.onArchive});

  final VoidCallback? onExplore;
  final VoidCallback onArchive;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primary, Color(0xFF123A44)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(30),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.explore_outlined,
                  size: 16,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'PLAN YOUR NEXT ASCENT',
                style: AppText.mono(
                  11,
                  Colors.white.withAlpha(210),
                  FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            'Ready for another trail?',
            style: AppText.title(23, Colors.white),
          ),
          const SizedBox(height: 6),
          Text(
            'Discover verified seats across curated alpine and glacier routes worldwide.',
            style: AppText.body(13.5, Colors.white.withAlpha(190)),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              FilledButton(
                onPressed: onExplore,
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.coral,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Row(
                  children: [
                    Text(
                      'Explore Trips',
                      style: AppText.label(14, Colors.white),
                    ),
                    const SizedBox(width: 6),
                    const Icon(Icons.north_east, size: 16),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              FilledButton(
                onPressed: onArchive,
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white.withAlpha(30),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  'Past Archive',
                  style: AppText.label(14, Colors.white),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
