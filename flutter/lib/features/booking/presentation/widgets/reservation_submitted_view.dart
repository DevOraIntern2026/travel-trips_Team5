import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../home/data/models/trip_model.dart';
import '../../data/models/booking_model.dart';
import '../../data/models/trip_date_model.dart';
import 'reservation/submitted_hero.dart';
import 'reservation/submitted_next_steps.dart';
import 'reservation/submitted_questions.dart';
import 'reservation/submitted_reference_card.dart';
import 'reservation/submitted_trip_card.dart';

class ReservationSubmittedView extends StatelessWidget {
  final BookingModel booking;
  final TripDateModel? date;
  final TripModel? trip;

  const ReservationSubmittedView({
    super.key,
    required this.booking,
    this.date,
    this.trip,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      children: [
        SubmittedHero(booking: booking, trip: trip),
        const SizedBox(height: 14),
        SubmittedReferenceCard(booking: booking),
        const SizedBox(height: 14),
        SubmittedTripCard(booking: booking, date: date, trip: trip),
        const SizedBox(height: 14),
        SubmittedNextSteps(booking: booking, trip: trip),
        const SizedBox(height: 14),
        SubmittedQuestions(),
        const SizedBox(height: 16),
        SizedBox(
          height: 56,
          child: FilledButton(
            onPressed: () => context.go(
              '/bookings?refresh=${DateTime.now().microsecondsSinceEpoch}',
            ),
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.coral,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'View in My Bookings',
                  style: AppText.label(16, Colors.white),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward_rounded, size: 19),
              ],
            ),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 52,
          child: FilledButton.icon(
            onPressed: () {
              // TODO: add to calendar
            },
            icon: const Icon(Icons.event_available_outlined, size: 19),
            label: Text(
              'Add to Apple / Google Calendar',
              style: AppText.label(14.5),
            ),
            style: FilledButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.ink,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
          ),
        ),
        TextButton.icon(
          onPressed: () {
            // TODO: download PDF summary
          },
          icon: const Icon(Icons.download_outlined, size: 16),
          label: Text(
            'Download Reservation Summary (PDF)',
            style: AppText.label(12, AppColors.primary, FontWeight.w600),
          ),
        ),
      ],
    );
  }
}
