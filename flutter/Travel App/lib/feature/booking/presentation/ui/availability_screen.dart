import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../../data/models/trip_date_model.dart';
import '../cubit/availability_cubit.dart';
import '../cubit/availability_state.dart';
import '../cubit/trip_dates_cubit.dart';
import '../cubit/trip_dates_state.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../widgets/availability_card.dart';
import '../widgets/booking_app_bar.dart';
import '../widgets/booking_empty_state.dart';
import '../widgets/booking_error_state.dart';
import '../widgets/booking_info_card.dart';
import '../widgets/booking_loading_state.dart';
import '../widgets/trip_date_card.dart';
import '../widgets/trip_header_card.dart';
import 'booking_screen.dart';

class AvailabilityScreen extends StatefulWidget {
  final int tripId;
  final int dateId;

  const AvailabilityScreen({
    super.key,
    required this.tripId,
    required this.dateId,
  });

  @override
  State<AvailabilityScreen> createState() => _AvailabilityScreenState();
}

class _AvailabilityScreenState extends State<AvailabilityScreen> {
  late int _selectedDateId;

  @override
  void initState() {
    super.initState();
    _selectedDateId = widget.dateId;
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) =>
              getIt<AvailabilityCubit>()
                ..getAvailability(widget.tripId, widget.dateId),
        ),
        BlocProvider(
          create: (_) => getIt<TripDatesCubit>()..getTripDates(widget.tripId),
        ),
      ],
      child: Scaffold(
        backgroundColor: BookingColors.background,
        appBar: const BookingAppBar('Select Dates & Seats'),
        body: SingleChildScrollView(
          padding: BookingSpacing.screenPadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TripHeaderCard(tripId: widget.tripId),
              const BookingSectionTitle('Available Departures'),
              _buildTripDates(),
              const BookingSectionTitle('Availability'),
              _buildAvailability(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTripDates() {
    return BlocBuilder<TripDatesCubit, TripDatesState>(
      builder: (context, state) {
        if (state is TripDatesLoading) {
          return const Padding(
            padding: EdgeInsets.all(BookingSpacing.xxl),
            child: BookingLoadingState(),
          );
        }

        if (state is TripDatesError) {
          return BookingErrorState(
            message: state.message,
            onRetry: () =>
                context.read<TripDatesCubit>().getTripDates(widget.tripId),
          );
        }

        if (state is TripDatesSuccess) {
          if (state.tripDates.isEmpty) {
            return const BookingEmptyState(
              message: 'No open departures',
              hint: 'This trip has no bookable dates right now.',
            );
          }

          return Column(
            children: state.tripDates
                .map(
                  (date) => Padding(
                    padding: const EdgeInsets.only(bottom: BookingSpacing.md),
                    child: TripDateCard(
                      date: date,
                      selected: date.id == _selectedDateId,
                      onTap: () => _selectDate(context, date),
                    ),
                  ),
                )
                .toList(),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildAvailability() {
    return BlocBuilder<AvailabilityCubit, AvailabilityState>(
      builder: (context, state) {
        if (state is AvailabilityLoading) {
          return const Padding(
            padding: EdgeInsets.all(BookingSpacing.xxl),
            child: BookingLoadingState(),
          );
        }

        if (state is AvailabilityError) {
          return BookingErrorState(
            message: state.message,
            onRetry: () => context
                .read<AvailabilityCubit>()
                .getAvailability(widget.tripId, _selectedDateId),
          );
        }

        if (state is AvailabilitySuccess) {
          return AvailabilityCard(
            availability: state.availability,
            onContinue: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) =>
                    BookingScreen(tripId: widget.tripId, dateId: _selectedDateId),
              ),
            ),
          );
        }

        return const SizedBox.shrink();
      },
    );
  }

  void _selectDate(BuildContext context, TripDateModel date) {
    setState(() => _selectedDateId = date.id);
    context
        .read<AvailabilityCubit>()
        .getAvailability(widget.tripId, date.id);
  }
}