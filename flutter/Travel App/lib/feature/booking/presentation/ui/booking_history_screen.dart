import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../../data/models/booking_model.dart';
import '../cubit/booking_history_cubit.dart';
import '../cubit/booking_history_state.dart';
import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../widgets/booking_app_bar.dart';
import '../widgets/booking_empty_state.dart';
import '../widgets/booking_error_state.dart';
import '../widgets/booking_history_card.dart';
import '../widgets/booking_loading_state.dart';
import 'booking_details_screen.dart';

class BookingHistoryScreen extends StatelessWidget {
  const BookingHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<BookingHistoryCubit>()..getBookings(),
      child: Scaffold(
        backgroundColor: BookingColors.background,
        appBar: const BookingAppBar('My Bookings'),
        body: BlocBuilder<BookingHistoryCubit, BookingHistoryState>(
          builder: (context, state) {
            if (state is BookingHistoryLoading) {
              return const BookingLoadingState(
                message: 'Loading your bookings…',
              );
            }

            if (state is BookingHistoryError) {
              return BookingErrorState(
                message: state.message,
                onRetry: () =>
                    context.read<BookingHistoryCubit>().getBookings(),
              );
            }

            if (state is BookingHistorySuccess) {
              if (state.bookings.isEmpty) {
                return const BookingEmptyState(
                  message: 'No bookings yet',
                  hint: 'Your reservations will appear here.',
                  icon: Icons.luggage_outlined,
                );
              }

              return ListView.builder(
                padding: BookingSpacing.screenPadding,
                itemCount: state.bookings.length,
                itemBuilder: (context, index) {
                  final booking = state.bookings[index];

                  return Padding(
                    padding: const EdgeInsets.only(bottom: BookingSpacing.lg),
                    child: BookingHistoryCard(
                      booking: booking,
                      onTap: () => _openDetails(context, booking),
                    ),
                  );
                },
              );
            }

            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  void _openDetails(BuildContext context, BookingModel booking) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BookingDetailsScreen(bookingId: booking.id),
      ),
    );
  }
}