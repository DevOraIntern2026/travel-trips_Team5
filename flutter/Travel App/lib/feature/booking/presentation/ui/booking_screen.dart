import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/flow_top_bar.dart';
import '../../../home/data/models/trip_model.dart';
import '../../../main/presentation/ui/main_shell.dart';
import '../../data/models/trip_date_model.dart';
import '../cubit/booking_cubit.dart';
import '../cubit/booking_state.dart';
import '../utils/booking_formatters.dart';
import '../widgets/booking_loading_state.dart';
import '../widgets/edge_state_views/network_sync_view.dart';
import '../widgets/edge_state_views/seat_collision_view.dart';
import '../widgets/reservation_submitted_view.dart';
import '../widgets/review_and_confirm_view.dart';

/// Final booking review and reservation result.
class BookingScreen extends StatelessWidget {
  final int tripId;
  final int dateId;
  final TripDateModel? date;
  final TripModel? trip;

  const BookingScreen({
    super.key,
    required this.tripId,
    required this.dateId,
    this.date,
    this.trip,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<BookingCubit>(),
      child: BlocBuilder<BookingCubit, BookingState>(
        builder: (context, state) {
          if (state is BookingSuccess) {
            return Scaffold(
              backgroundColor: AppColors.background,
              body: SafeArea(
                child: Column(
                  children: [
                    FlowTopBar(
                      title: 'Reservation Submitted',
                      showBack: false,
                      showLogoTagline: true,
                      actions: [
                        TopBarIcon(
                          Icons.close,
                          onTap: () => MainShell.open(context, tab: 1),
                        ),
                      ],
                    ),
                    Expanded(
                      child: ReservationSubmittedView(
                        booking: state.booking,
                        date: date,
                        trip: trip,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          return Scaffold(
            backgroundColor: AppColors.background,
            body: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  const FlowTopBar(
                    eyebrow: 'RESERVATION FLOW',
                    title: 'Review & Confirm',
                  ),
                  Expanded(child: _body(context, state)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _body(BuildContext context, BookingState state) {
    if (state is BookingLoading) {
      return const BookingLoadingState(message: 'Submitting your reservation…');
    }

    if (state is BookingError && state.isSeatCollision) {
      return ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SeatCollisionView(
            tripTitle: trip?.title ?? 'Trip #$tripId',
            dateRange: date == null
                ? null
                : formatBookingRange(date!.startDate, date!.endDate),
            imageUrl: trip?.imageUrl,
            // Return to departure selection.
            onSwitchDeparture: () {
              Navigator.of(context).pop();
            },
            onReturn: () => Navigator.of(context).maybePop(),
          ),
        ],
      );
    }

    if (state is BookingError && state.isNetworkError) {
      return ListView(
        padding: const EdgeInsets.all(16),
        children: [
          NetworkSyncView(
            message: state.message,
            reference: 'Trip #$tripId • Departure #$dateId',
            summary: '1 seat',
            onRetry: () => context.read<BookingCubit>().createBooking(dateId),
            onSaveDraft: () => context.read<BookingCubit>().reset(),
          ),
        ],
      );
    }

    return ReviewAndConfirmView(
      tripId: tripId,
      dateId: dateId,
      date: date,
      trip: trip,
      errorMessage: state is BookingError ? state.message : null,
    );
  }
}
