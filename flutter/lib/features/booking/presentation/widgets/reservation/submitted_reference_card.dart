import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/utils/clipboard_actions.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/booking_model.dart';
import '../../../data/models/booking_status.dart';
import '../../utils/booking_formatters.dart';

/// Booking reference block with the copy-to-clipboard action.
class SubmittedReferenceCard extends StatelessWidget {
  const SubmittedReferenceCard({super.key, required this.booking});
  final BookingModel booking;
  bool get _confirmed => BookingStatus.isConfirmed(booking.status);
  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'REFERENCE CODE',
                style: AppText.mono(11, AppColors.ink.withAlpha(200)),
              ),
              Text(
                'SUBMITTED',
                style: AppText.mono(11, AppColors.ink.withAlpha(200)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Text(
                'Ref #${booking.id}',
                style: AppText.mono(15, AppColors.ink, FontWeight.w700),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: () => copyBookingReference(context, '${booking.id}'),
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.infoSurface,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.copy_outlined, size: 15),
                ),
              ),
              const Spacer(),
              Flexible(
                child: Text(
                  formatBookingDateTime(booking.createdAt.toLocal()),
                  textAlign: TextAlign.end,
                  style: AppText.body(12.5, AppColors.ink.withAlpha(210)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SoftBox(
            color: _confirmed ? AppColors.mint : AppColors.infoSurface,
            child: Row(
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: _confirmed ? AppColors.success : AppColors.coral,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _confirmed ? 'Confirmed' : 'Pending',
                        style: AppText.label(
                          12.5,
                          _confirmed ? AppColors.success : AppColors.error,
                        ),
                      ),
                      Text(
                        _confirmed
                            ? 'The booking service confirmed your reservation.'
                            : 'The booking service has not confirmed this reservation yet.',
                        style: AppText.body(12.5, AppColors.ink.withAlpha(210)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
