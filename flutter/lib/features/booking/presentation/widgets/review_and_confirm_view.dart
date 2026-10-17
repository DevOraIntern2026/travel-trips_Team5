import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../home/data/models/trip_model.dart';
import '../../data/models/trip_date_model.dart';
import 'review/review_agreement_card.dart';
import 'review/review_bottom_bar.dart';
import 'review/review_booking_notice.dart';
import 'review/review_fare_card.dart';
import 'review/review_step_card.dart';
import 'review/review_traveler_card.dart';
import 'review/review_trip_card.dart';

class ReviewAndConfirmView extends StatefulWidget {
  final int tripId;
  final int dateId;
  final TripDateModel? date;
  final TripModel? trip;
  final String? errorMessage;

  const ReviewAndConfirmView({
    super.key,
    required this.tripId,
    required this.dateId,
    this.date,
    this.trip,
    this.errorMessage,
  });

  @override
  State<ReviewAndConfirmView> createState() => _ReviewAndConfirmViewState();
}

class _ReviewAndConfirmViewState extends State<ReviewAndConfirmView> {
  bool _agreed = false;

  double? get _total => widget.date?.price;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 20),
            children: [
              const ReviewStepCard(),
              const SizedBox(height: 14),
              const ReviewBookingNotice(),
              const SizedBox(height: 14),
              if (widget.errorMessage != null) ...[
                const SizedBox(height: 14),
                SoftBox(
                  color: AppColors.errorSurface,
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline, color: AppColors.error),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          widget.errorMessage!,
                          style: AppText.label(13, AppColors.error),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 14),
              ReviewTripCard(
                trip: widget.trip,
                date: widget.date,
                tripId: widget.tripId,
              ),
              const SizedBox(height: 14),
              const ReviewTravelerCard(),
              if (_total != null) ...[
                const SizedBox(height: 14),
                ReviewFareCard(unitPrice: widget.date!.price),
              ],
              const SizedBox(height: 14),
              ReviewAgreementCard(
                agreed: _agreed,
                onChanged: (v) => setState(() => _agreed = v),
              ),
            ],
          ),
        ),
        ReviewBottomBar(
          dateId: widget.dateId,
          agreed: _agreed,
          onAgreeChanged: (v) => setState(() => _agreed = v),
        ),
      ],
    );
  }
}
