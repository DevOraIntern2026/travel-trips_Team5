import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/flow_top_bar.dart';
import '../cubit/booking_details_cubit.dart';
import '../cubit/booking_details_state.dart';
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
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Column(
            children: [
              const FlowTopBar(
                title: 'Booking Detail &\nStatus Timeline',
                actions: [TopBarIcon(Icons.search)],
              ),
              Expanded(
                child: BlocBuilder<BookingDetailsCubit, BookingDetailsState>(
                  builder: (context, state) {
                    if (state is BookingDetailsLoading ||
                        state is BookingDetailsInitial) {
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

                    final s = state as BookingDetailsSuccess;
                    return BookingDetailsView(
                      booking: s.booking,
                      status: s.status,
                      tripDate: s.tripDate,
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
