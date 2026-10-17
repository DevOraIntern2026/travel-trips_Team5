import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../data/models/booking_model.dart';
import '../../data/models/booking_status.dart';
import '../../data/models/trip_date_model.dart';
import '../utils/booking_display.dart';
import '../utils/booking_formatters.dart';

class BookingHistoryCard extends StatelessWidget {
  final BookingModel booking;
  final TripDateModel? tripDate;
  final VoidCallback onTap;
  const BookingHistoryCard({
    super.key,
    required this.booking,
    required this.onTap,
    this.tripDate,
  });
  bool get _confirmed => BookingStatus.isConfirmed(booking.status);
  bool get _cancelled => BookingStatus.isCancelled(booking.status);
  @override
  Widget build(BuildContext context) {
    final accent = _cancelled
        ? AppColors.error
        : _confirmed
        ? AppColors.primary
        : AppColors.coral;
    final until = tripDate == null ? null : startsIn(tripDate!);
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withAlpha(14),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          Container(
            height: 4,
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [accent, accent.withAlpha(40)]),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'REF #${booking.id}',
                            style: AppText.mono(12, AppColors.ink),
                          ),
                          Text(
                            _confirmed
                                ? 'Confirmed ${timeAgo(booking.createdAt)}'
                                : 'Booked ${timeAgo(booking.createdAt)}',
                            style: AppText.body(
                              12.5,
                              AppColors.ink.withAlpha(200),
                            ),
                          ),
                        ],
                      ),
                    ),
                    _statusPill(),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    TripImage(
                      width: 80,
                      height: 80,
                      radius: 12,
                      child:
                          tripDate == null || shortDuration(tripDate!) == null
                          ? null
                          : Align(
                              alignment: Alignment.bottomRight,
                              child: Container(
                                margin: const EdgeInsets.all(5),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white.withAlpha(230),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  shortDuration(tripDate!)!,
                                  style: AppText.mono(
                                    10.5,
                                    AppColors.ink,
                                    FontWeight.w700,
                                  ),
                                ),
                              ),
                            ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'ALPINE TREK',
                            style: AppText.label(
                              11,
                              AppColors.rust,
                            ).copyWith(letterSpacing: 0.6),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Trip #${booking.tripId}',
                            style: AppText.title(19),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Departure #${booking.tripDateId}',
                            style: AppText.body(
                              13,
                              AppColors.ink.withAlpha(200),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                SoftBox(
                  padding: const EdgeInsets.all(14),
                  radius: 16,
                  child: Column(
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.calendar_today_outlined,
                            size: 17,
                            color: AppColors.primary,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              tripDate == null
                                  ? 'Departure #${booking.tripDateId}'
                                  : formatBookingRange(
                                      tripDate!.startDate,
                                      tripDate!.endDate,
                                    ),
                              style: AppText.title(16),
                            ),
                          ),
                          if (until != null)
                            AppPill(
                              until,
                              background: AppColors.pendingSurface,
                              foreground: AppColors.pendingTextStrong,
                              fontSize: 11,
                            ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          const Spacer(),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                formatMoney(booking.price),
                                style: AppText.title(22),
                              ),
                              Text(
                                _cancelled ? 'Cancelled' : 'Booking price',
                                style: AppText.body(
                                  12,
                                  AppColors.ink.withAlpha(200),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                if (!_confirmed && !_cancelled) ...[
                  const SizedBox(height: 10),
                  SoftBox(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      children: [
                        Container(
                          width: 34,
                          height: 34,
                          decoration: const BoxDecoration(
                            color: AppColors.errorSurface,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.hourglass_top,
                            size: 17,
                            color: AppColors.error,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Current booking status: ${booking.status}.',
                            style: AppText.body(
                              12.5,
                              AppColors.ink.withAlpha(220),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      flex: _confirmed || _cancelled ? 1 : 1,
                      child: _Btn(
                        label: _confirmed
                            ? 'View Trip Hub & Prep'
                            : 'View Details',
                        icon: _confirmed ? Icons.explore_outlined : null,
                        background: AppColors.primary,
                        foreground: Colors.white,
                        trailing: Icons.arrow_forward,
                        onTap: onTap,
                      ),
                    ),
                    if (_confirmed) ...[
                      const SizedBox(width: 10),
                      InkWell(
                        onTap: () {
                          // TODO: share
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: AppColors.infoSurface,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.share_outlined, size: 20),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _statusPill() {
    if (_cancelled) {
      return const AppPill(
        'Cancelled',
        background: AppColors.errorSurface,
        foreground: AppColors.error,
        dot: true,
      );
    }
    if (_confirmed) {
      return const AppPill(
        'Confirmed Departure',
        background: AppColors.mint,
        foreground: AppColors.primary,
        icon: Icons.check_circle,
      );
    }
    return const AppPill(
      'Pending Confirmation',
      background: AppColors.pendingSurface,
      foreground: AppColors.pendingText,
      dot: true,
    );
  }
}

class _Btn extends StatelessWidget {
  const _Btn({
    required this.label,
    required this.background,
    required this.foreground,
    required this.onTap,
    this.icon,
    this.trailing,
  });

  final String label;
  final Color background;
  final Color foreground;
  final VoidCallback onTap;
  final IconData? icon;
  final IconData? trailing;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 50,
      child: FilledButton(
        onPressed: onTap,
        style: FilledButton.styleFrom(
          backgroundColor: background,
          foregroundColor: foreground,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 10),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 17),
              const SizedBox(width: 6),
            ],
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppText.label(13.5, foreground),
              ),
            ),
            if (trailing != null) ...[
              const SizedBox(width: 6),
              Icon(trailing, size: 17),
            ],
          ],
        ),
      ),
    );
  }
}
