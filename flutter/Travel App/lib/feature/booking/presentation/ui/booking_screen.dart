import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../cubit/booking_cubit.dart';
import '../cubit/booking_state.dart';
import '../theme/booking_colors.dart';
import '../widgets/booking_app_bar.dart';
import '../widgets/booking_loading_state.dart';
import '../widgets/reservation_submitted_view.dart';
import '../widgets/review_and_confirm_view.dart';

class BookingScreen extends StatelessWidget {
  final int tripId;
  final int dateId;

  const BookingScreen({super.key, required this.tripId, required this.dateId});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<BookingCubit>(),
      child: Scaffold(
        backgroundColor: BookingColors.background,
        appBar: const BookingAppBar(
          'Review & Confirm',
          background: BookingColors.primary,
          foreground: BookingColors.surface,
        ),
        body: BlocBuilder<BookingCubit, BookingState>(
          builder: (context, state) {
            if (state is BookingLoading) {
              return const BookingLoadingState(
                message: 'Submitting your reservation…',
              );
            }

            if (state is BookingSuccess) {
              return ReservationSubmittedView(booking: state.booking);
            }

            return ReviewAndConfirmView(
              tripId: tripId,
              dateId: dateId,
              errorMessage: state is BookingError ? state.message : null,
            );
          },
        ),
      ),
    );
  }
}