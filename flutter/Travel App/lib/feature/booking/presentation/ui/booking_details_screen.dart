import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../cubit/booking_details_cubit.dart';
import '../cubit/booking_details_state.dart';
import '../theme/booking_colors.dart';
import '../widgets/booking_app_bar.dart';
import '../widgets/booking_details_view.dart';
import '../widgets/booking_error_state.dart';
import '../widgets/booking_loading_state.dart';

class BookingDetailsScreen extends StatelessWidget {
  final int bookingId;

  const BookingDetailsScreen({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<BookingDetailsCubit>()..getBookingDetails(bookingId),
      child: Scaffold(
        backgroundColor: BookingColors.background,
        appBar: const BookingAppBar('Booking Details'),
        body: BlocBuilder<BookingDetailsCubit, BookingDetailsState>(
          builder: (context, state) {
            if (state is BookingDetailsLoading) {
              return const BookingLoadingState(
                message: 'Loading booking details…',
              );
            }

            if (state is BookingDetailsError) {
              return BookingErrorState(
                message: state.message,
                onRetry: () => context
                    .read<BookingDetailsCubit>()
                    .getBookingDetails(bookingId),
              );
            }

            if (state is BookingDetailsSuccess) {
              return BookingDetailsView(
                booking: state.booking,
                status: state.status,
              );
            }

            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }
}