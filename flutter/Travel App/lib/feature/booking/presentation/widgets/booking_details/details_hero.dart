import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/utils/clipboard_actions.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/booking_model.dart';
import '../../../data/models/booking_status.dart';
import '../../../data/models/trip_date_model.dart';
import '../../utils/booking_display.dart';
import '../../utils/booking_formatters.dart';

/// Header image, booking reference and status pill.
class BookingDetailsHero extends StatelessWidget {
  const BookingDetailsHero({
    super.key,
    required this.booking,
    required this.status,
    this.tripDate,
  });

  final BookingModel booking;

  /// Fresh status from `GET /bookings/:id`, shown next to the reference.
  final String status;
  final TripDateModel? tripDate;

  bool get _confirmed => BookingStatus.isConfirmed(booking.status);
  bool get _cancelled => BookingStatus.isCancelled(booking.status);

  Widget _infoBox(IconData icon, String label, String value) {
    return SoftBox(
      color: AppColors.infoSurface,
      padding: const EdgeInsets.all(10),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.primary),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppText.body(11, AppColors.ink.withAlpha(200)),
                ),
                Text(value, style: AppText.label(13.5), maxLines: 2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final Widget statusPill = _cancelled
        ? const AppPill(
            'Cancelled',
            background: AppColors.errorSurface,
            foreground: AppColors.error,
            dot: true,
          )
        : _confirmed
        ? const AppPill(
            'Confirmed Departure',
            background: AppColors.mint,
            foreground: AppColors.primary,
            dot: true,
          )
        : const AppPill(
            'Awaiting Confirmation',
            background: AppColors.pendingSurface,
            foreground: AppColors.pendingText,
            dot: true,
          );

    return AppCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TripImage(
            height: 150,
            radius: 16,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Positioned(
                  top: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(230),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '# TO-${booking.id}',
                          style: AppText.mono(
                            12,
                            AppColors.ink,
                            FontWeight.w700,
                          ),
                        ),
                        const SizedBox(width: 8),
                        InkWell(
                          onTap: () =>
                              copyBookingReference(context, '${booking.id}'),
                          child: const Icon(Icons.copy_outlined, size: 15),
                        ),
                      ],
                    ),
                  ),
                ),
                Positioned(top: 10, right: 10, child: statusPill),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text('Trip #${booking.tripId}', style: AppText.title(21)),
          const SizedBox(height: 4),
          Text(
            'Booked ${formatBookingDateTime(booking.createdAt.toLocal())}',
            style: AppText.body(12.5, AppColors.muted),
          ),
          if (tripDate != null) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _infoBox(
                    Icons.calendar_today_outlined,
                    'Expedition Dates',
                    formatBookingRange(tripDate!.startDate, tripDate!.endDate),
                  ),
                ),
                if (daysAndNights(tripDate!, sep: ' • ') != null) ...[
                  const SizedBox(width: 10),
                  Expanded(
                    child: _infoBox(
                      Icons.timelapse,
                      'Duration',
                      daysAndNights(tripDate!, sep: ' • ')!,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ],
      ),
    );
  }
}
