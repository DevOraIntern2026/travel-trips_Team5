import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/router/app_router.dart' show PassengerRouteData;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/text_format.dart';
import '../../../../core/widgets/app_sticky_bottom_bar.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../../core/widgets/flow_top_bar.dart';
import '../../../home/data/models/trip_model.dart';
import '../../data/models/availability_model.dart';
import '../../data/models/trip_date_model.dart';
import '../cubit/availability_cubit.dart';
import '../cubit/availability_state.dart';
import '../cubit/trip_dates_cubit.dart';
import '../cubit/trip_dates_state.dart';
import '../utils/booking_display.dart';
import '../utils/booking_formatters.dart';
import '../widgets/booking_empty_state.dart';
import '../widgets/booking_error_state.dart';
import '../widgets/booking_loading_state.dart';
import '../widgets/availability/availability_departure_card.dart';
import '../widgets/availability/availability_month_chip.dart';
import '../widgets/availability/availability_step_progress.dart';
import '../widgets/availability/availability_term_card.dart';
import '../widgets/availability/availability_traveler_notice.dart';
import '../widgets/availability/availability_trip_card.dart';

/// Step 2 â€” Select Dates & Seats.
class AvailabilityScreen extends StatefulWidget {
  final int tripId;
  final int? dateId;
  final TripModel? trip;

  const AvailabilityScreen({
    super.key,
    required this.tripId,
    this.dateId,
    this.trip,
  });

  @override
  State<AvailabilityScreen> createState() => _AvailabilityScreenState();
}

class _AvailabilityScreenState extends State<AvailabilityScreen> {
  TripDateModel? _selected;
  String? _month;

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<AvailabilityCubit>()),
        BlocProvider(
          create: (_) =>
              getIt<TripDatesCubit>()..getTripDates(widget.tripId, limit: 50),
        ),
      ],
      child: Builder(
        builder: (context) {
          return BlocListener<TripDatesCubit, TripDatesState>(
            listener: (context, state) {
              if (state is TripDatesSuccess &&
                  _selected == null &&
                  state.tripDates.isNotEmpty) {
                final bookableDates = state.tripDates
                    .where(_hasRemainingCapacity)
                    .toList();
                if (bookableDates.isEmpty) return;
                final initial = bookableDates.firstWhere(
                  (date) => date.id == widget.dateId,
                  orElse: () => bookableDates.first,
                );
                _select(context, initial);
              }
            },
            child: Scaffold(
              backgroundColor: AppColors.background,
              body: SafeArea(
                bottom: false,
                child: Column(
                  children: [
                    const FlowTopBar(
                      eyebrow: 'RESERVATION FLOW',
                      title: 'Select Dates & Seats',
                    ),
                    Expanded(child: _buildBody(context)),
                  ],
                ),
              ),
              bottomNavigationBar: _buildBottomBar(context),
            ),
          );
        },
      ),
    );
  }

  bool _hasRemainingCapacity(TripDateModel date) =>
      date.isActive && date.bookedSeats < date.capacity;

  void _select(BuildContext context, TripDateModel date) {
    setState(() {
      _selected = date;
      _month = monthKey(DateTime.tryParse(date.startDate) ?? DateTime.now());
    });
    context.read<AvailabilityCubit>().getAvailability(widget.tripId, date.id);
  }

  AvailabilityModel? _availability(BuildContext context) {
    final s = context.watch<AvailabilityCubit>().state;
    return s is AvailabilitySuccess ? s.availability : null;
  }

  Widget _buildBody(BuildContext context) {
    return BlocBuilder<TripDatesCubit, TripDatesState>(
      builder: (context, state) {
        if (state is TripDatesLoading || state is TripDatesInitial) {
          return const BookingLoadingState();
        }

        if (state is TripDatesError) {
          return BookingErrorState(
            message: state.message,
            onRetry: () => context.read<TripDatesCubit>().getTripDates(
              widget.tripId,
              limit: 50,
            ),
          );
        }

        final dates = (state as TripDatesSuccess).tripDates;

        final bookableDates = dates.where(_hasRemainingCapacity).toList();
        if (bookableDates.isEmpty) {
          return const BookingEmptyState(
            message: 'Sold out',
            hint: 'All departures for this trip are full right now.',
          );
        }

        final availability = _availability(context);
        final months = <String, DateTime>{};
        for (final d in bookableDates) {
          final s = DateTime.tryParse(d.startDate);
          if (s != null) months.putIfAbsent(monthKey(s), () => s);
        }
        final monthKeys = months.keys.toList()..sort();
        final inMonth = bookableDates.where((d) {
          final s = DateTime.tryParse(d.startDate);
          return _month == null || s == null || monthKey(s) == _month;
        }).toList();

        return ListView(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
          children: [
            const AvailabilityStepProgress(),
            const SizedBox(height: 12),
            AvailabilityTripCard(
              trip: widget.trip,
              tripId: widget.tripId,
              dates: dates,
              selected: _selected,
            ),
            const SizedBox(height: 22),
            SectionTitle(
              'Select Expedition Month',
              icon: Icons.calendar_month_outlined,
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 46,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  for (final key in monthKeys)
                    MonthChip(
                      label: monthYearLabel(months[key]!),
                      selected: key == _month,
                      onTap: () => setState(() => _month = key),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 18),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('AVAILABLE DEPARTURES', style: AppText.mono(11.5)),
                Text(
                  plural(
                    inMonth.where(_hasRemainingCapacity).length,
                    'opening',
                    'openings',
                  ),
                  style: AppText.mono(11.5),
                ),
              ],
            ),
            const SizedBox(height: 12),
            for (final d in inMonth)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: DepartureCard(
                  date: d,
                  selected: d.id == _selected?.id,
                  availability: d.id == _selected?.id ? availability : null,
                  onTap: _hasRemainingCapacity(d)
                      ? () => _select(context, d)
                      : null,
                ),
              ),
            if (_selected != null) ...[
              const SizedBox(height: 6),
              const AvailabilityTravelerNotice(),
              const SizedBox(height: 14),
              _tripTerms(),
            ],
          ],
        );
      },
    );
  }

  Widget _tripTerms() {
    final cancellationWindow = widget.trip?.cancellationWindowHours;
    final cancellationLabel = cancellationWindow == null
        ? 'Set by operator'
        : '$cancellationWindow hours';

    return Row(
      children: [
        Expanded(
          child: TermCard(
            icon: Icons.calendar_month_outlined,
            label: 'SELECTED DEPARTURE',
            value: _selected == null
                ? 'Choose a date'
                : formatBookingRange(_selected!.startDate, _selected!.endDate),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: TermCard(
            icon: Icons.history_toggle_off_outlined,
            label: 'CANCELLATION WINDOW',
            value: cancellationLabel,
          ),
        ),
      ],
    );
  }

  Widget? _buildBottomBar(BuildContext context) {
    // Needs the cubit providers => wrap in Builder with the screen context.
    return Builder(
      builder: (context) {
        final availability = _availability(context);
        final selected = _selected;
        final canContinue =
            selected != null &&
            _hasRemainingCapacity(selected) &&
            availability != null &&
            availability.available &&
            availability.remainingSeats > 0;

        return AppStickyBottomBar(
          child: Row(
            children: [
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text.rich(
                      TextSpan(
                        children: [
                          TextSpan(
                            text: selected == null
                                ? 'â€”'
                                : formatMoney(selected.price),
                            style: AppText.mono(
                              24,
                              AppColors.ink,
                              FontWeight.w700,
                            ),
                          ),
                          TextSpan(
                            text: ' USD',
                            style: AppText.mono(11, AppColors.muted),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '1 seat',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppText.body(11.5, AppColors.muted),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              SizedBox(
                height: 54,
                child: FilledButton(
                  onPressed: canContinue
                      ? () => context.push(
                          '/trips/${widget.tripId}/passengers',
                          extra: PassengerRouteData(
                            tripId: widget.tripId,
                            dateId: selected.id,
                            date: selected,
                            trip: widget.trip,
                          ),
                        )
                      : null,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.coral,
                    padding: const EdgeInsets.symmetric(horizontal: 22),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Continue to Booking',
                        style: AppText.label(15, Colors.white),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward_rounded, size: 19),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
