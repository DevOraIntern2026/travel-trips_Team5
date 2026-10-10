import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/trip.dart';
import '../../domain/entities/trip_date.dart';
import '../cubit/trip_details_cubit.dart';
import '../cubit/trip_request_status.dart';
import '../utils/trip_formatters.dart';
import '../widgets/media_placeholder.dart';
import 'destination_details_page.dart';

class TripDetailsPage extends StatelessWidget {
  const TripDetailsPage({super.key, required this.tripId});

  final int tripId;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<TripDetailsCubit>()..loadTrip(tripId),
      child: _TripDetailsView(tripId: tripId),
    );
  }
}

class _TripDetailsView extends StatelessWidget {
  const _TripDetailsView({required this.tripId});

  final int tripId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: BlocBuilder<TripDetailsCubit, TripDetailsState>(
        builder: (context, state) {
          if (state.tripStatus == TripRequestStatus.loading ||
              state.tripStatus == TripRequestStatus.initial) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.tripStatus == TripRequestStatus.failure || state.trip == null) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(state.tripFailure?.message ?? 'Trip details could not be loaded.'),
                    const SizedBox(height: 10),
                    OutlinedButton(
                      onPressed: () => context.read<TripDetailsCubit>().loadTrip(tripId),
                      child: const Text('Try again'),
                    ),
                  ],
                ),
              ),
            );
          }

          final trip = state.trip!;
          final dates = state.dates?.data ?? const <TripDate>[];
          final nextDate = TripFormatters.earliest(dates);
          final selected = dates.where((date) => date.id == state.selectedDateId).firstOrNull;
          final priceDate = selected ?? nextDate;
          final description = trip.description?.trim();
          final highlights = _highlights(trip);

          return Column(
            children: [
              Expanded(
                child: CustomScrollView(
                  slivers: [
                    SliverToBoxAdapter(child: _heroHeader(trip: trip)),
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              TripFormatters.location(trip),
                              style: const TextStyle(color: AppColors.muted, fontSize: 13),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              trip.name,
                              style: const TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                                height: 1.15,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: [
                                StatusPill(
                                  label: trip.isActive ? 'Verified Tour Operator' : 'Unavailable',
                                  color: trip.isActive ? AppColors.success : AppColors.soldOut,
                                  filled: false,
                                ),
                                if (state.tripOperator != null)
                                  StatusPill(
                                    label: state.tripOperator!.name,
                                    color: AppColors.forest,
                                    filled: false,
                                  ),
                              ],
                            ),
                            if (nextDate != null) ...[
                              const SizedBox(height: 14),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(14),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFFF1EB),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'NEXT DEPARTURE',
                                      style: TextStyle(
                                        color: AppColors.terracotta,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.6,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      TripFormatters.range(nextDate.startDate, nextDate.endDate),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w800,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${nextDate.capacity - nextDate.bookedSeats} seats left  ·  ${TripFormatters.money(nextDate.price)} / person',
                                      style: const TextStyle(color: AppColors.muted, fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                            const SizedBox(height: 22),
                            const Text(
                              'Expedition Overview',
                              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: _stat(
                                    'Duration',
                                    TripFormatters.durationLabel(trip.durationDays),
                                  ),
                                ),
                                Expanded(
                                  child: _stat(
                                    'Group Size',
                                    nextDate == null ? 'Small group' : 'Max ${nextDate.capacity}',
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Expanded(
                                  child: _stat(
                                    'Activity Level',
                                    trip.durationDays >= 7 ? 'Challenging' : 'Moderate',
                                  ),
                                ),
                                Expanded(
                                  child: _stat(
                                    'Cancel Window',
                                    '${trip.cancellationWindowHours}h',
                                  ),
                                ),
                              ],
                            ),
                            if (description != null && description.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Text(
                                description,
                                style: const TextStyle(color: AppColors.muted, height: 1.5),
                              ),
                            ],
                            const SizedBox(height: 22),
                            const Text(
                              'Itinerary Highlights',
                              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                            ),
                            const SizedBox(height: 12),
                            ...highlights.asMap().entries.map(
                              (entry) => _itineraryTile(
                                index: entry.key + 1,
                                title: entry.value.$1,
                                body: entry.value.$2,
                              ),
                            ),
                            const SizedBox(height: 22),
                            const Text(
                              'What’s Covered',
                              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                            ),
                            const SizedBox(height: 10),
                            _covered(true, 'Guided expedition days and local briefing'),
                            _covered(true, 'Confirmed small-group departure windows'),
                            _covered(true, 'Free cancellation within ${trip.cancellationWindowHours} hours'),
                            _covered(false, 'International flights and personal gear'),
                            const SizedBox(height: 22),
                            const Text(
                              'Departure Logistics',
                              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                            ),
                            const SizedBox(height: 10),
                            MediaPlaceholder(
                              seed: trip.id + 9,
                              height: 140,
                              child: Align(
                                alignment: Alignment.center,
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.location_on, color: Colors.white),
                                    const SizedBox(height: 4),
                                    Text(
                                      TripFormatters.location(trip),
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 10),
                            _logistics(
                              trip.destination?.city ?? 'Meeting point',
                              'Start in ${TripFormatters.location(trip)}. Operator coordinates the first transfer.',
                            ),
                            const SizedBox(height: 16),
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: AppColors.forestSoft,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Row(
                                children: [
                                  CircleAvatar(
                                    backgroundColor: AppColors.forest,
                                    child: Icon(Icons.verified_user, color: Colors.white, size: 18),
                                  ),
                                  SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'TravelOra Peace of Mind',
                                          style: TextStyle(fontWeight: FontWeight.w800),
                                        ),
                                        Text(
                                          'Seats sync live with operators. No overbooking on confirmed dates.',
                                          style: TextStyle(color: AppColors.muted, fontSize: 12),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 22),
                            Row(
                              children: [
                                const Text(
                                  'Available dates',
                                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                                ),
                                const Spacer(),
                                if (state.dates != null)
                                  Text('${state.dates!.total} dates'),
                              ],
                            ),
                            const SizedBox(height: 10),
                            if (state.datesStatus == TripRequestStatus.loading)
                              const Center(child: CircularProgressIndicator())
                            else if (dates.isEmpty)
                              const Text('There are no active dates for this trip yet.')
                            else
                              ...dates.map(
                                (date) => _dateTile(
                                  context,
                                  trip.id,
                                  date,
                                  date.id == state.selectedDateId,
                                ),
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
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'From',
                            style: TextStyle(color: AppColors.muted, fontSize: 12),
                          ),
                          Text(
                            priceDate == null
                                ? 'See dates'
                                : TripFormatters.money(priceDate.price),
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 24,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      FilledButton(
                        onPressed: dates.isEmpty
                            ? null
                            : () {
                                final date = nextDate;
                                if (date != null) {
                                  context.read<TripDetailsCubit>().selectTripDate(trip.id, date.id);
                                }
                              },
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.forest,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 22,
                            vertical: 14,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: const Text('Check Dates & Book'),
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

  List<(String, String)> _highlights(Trip trip) {
    final city = trip.destination?.city ?? 'the trailhead';
    final country = trip.destination?.country ?? 'the region';
    return [
      ('Arrival in $city', 'Meet the operator team and settle in before the first walking day.'),
      ('Signature route days', 'Guided days through ${trip.name} with overnight stays along the way.'),
      ('Return via $country', 'Final briefing, transfer out, and buffer time for onward travel.'),
    ];
  }

  Widget _heroHeader({required Trip trip}) {
    return Builder(
      builder: (context) {
        return Stack(
          children: [
            MediaPlaceholder(
              seed: trip.id,
              height: 260,
              borderRadius: BorderRadius.zero,
              overlay: LinearGradient(
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
                colors: [
                  Colors.black.withValues(alpha: 0.45),
                  Colors.transparent,
                ],
              ),
            ),
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
                child: Row(
                  children: [
                    _circle(Icons.arrow_back, () => Navigator.pop(context)),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.92),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        TripFormatters.durationLabel(trip.durationDays),
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
                      ),
                    ),
                    const SizedBox(width: 8),
                    StatusPill(
                      label: trip.isActive ? 'Confirmed Departure' : 'Unavailable',
                      color: trip.isActive ? AppColors.success : AppColors.soldOut,
                    ),
                    const Spacer(),
                    _circle(Icons.ios_share_outlined, () {}),
                    const SizedBox(width: 8),
                    _circle(Icons.favorite_border, () {}),
                  ],
                ),
              ),
            ),
            if (trip.destination != null)
              Positioned(
                left: 16,
                bottom: 16,
                child: GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => DestinationDetailsPage(destination: trip.destination!),
                      ),
                    );
                  },
                  child: Text(
                    'OPEN DESTINATION  →',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.92),
                      fontWeight: FontWeight.w700,
                      fontSize: 11,
                      letterSpacing: 0.6,
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  Widget _circle(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: CircleAvatar(
        backgroundColor: Colors.white,
        child: Icon(icon, color: AppColors.forest, size: 18),
      ),
    );
  }

  Widget _stat(String label, String value) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.cream,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: AppColors.muted, fontSize: 11)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }

  Widget _itineraryTile({
    required int index,
    required String title,
    required String body,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 14,
            backgroundColor: AppColors.forestSoft,
            child: Text(
              '$index',
              style: const TextStyle(
                color: AppColors.forest,
                fontWeight: FontWeight.w800,
                fontSize: 12,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text(body, style: const TextStyle(color: AppColors.muted, fontSize: 13, height: 1.4)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _covered(bool included, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(
            included ? Icons.check_circle : Icons.cancel,
            size: 18,
            color: included ? AppColors.success : AppColors.danger,
          ),
          const SizedBox(width: 8),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }

  Widget _logistics(String title, String body) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(Icons.directions_bus_filled_outlined, color: AppColors.forest),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
                Text(body, style: const TextStyle(color: AppColors.muted, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _dateTile(
    BuildContext context,
    int tripId,
    TripDate date,
    bool selected,
  ) {
    final remaining = date.capacity - date.bookedSeats;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () => context.read<TripDetailsCubit>().selectTripDate(tripId, date.id),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: selected ? AppColors.forestSoft : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: selected ? AppColors.forest : AppColors.border,
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Row(
            children: [
              const Icon(Icons.calendar_month_outlined, color: AppColors.forest),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      TripFormatters.range(date.startDate, date.endDate),
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    Text(
                      remaining > 0 ? '$remaining seats left' : 'Full capacity',
                      style: const TextStyle(color: AppColors.muted, fontSize: 12),
                    ),
                  ],
                ),
              ),
              Text(
                TripFormatters.money(date.price),
                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
