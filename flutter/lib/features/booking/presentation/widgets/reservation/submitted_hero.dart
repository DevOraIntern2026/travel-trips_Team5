import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../../home/data/models/trip_model.dart';
import '../../../data/models/booking_model.dart';
import '../../../data/models/booking_status.dart';

/// Success hero: an animated check badge, booking state and confirmation note.
class SubmittedHero extends StatefulWidget {
  const SubmittedHero({super.key, required this.booking, this.trip});

  final BookingModel booking;
  final TripModel? trip;

  @override
  State<SubmittedHero> createState() => _SubmittedHeroState();
}

class _SubmittedHeroState extends State<SubmittedHero>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 850),
  )..forward();

  bool get _confirmed => BookingStatus.isConfirmed(widget.booking.status);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [AppColors.infoSurface.withAlpha(180), AppColors.mintSoft],
        ),
      ),
      child: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              ScaleTransition(
                scale: CurvedAnimation(
                  parent: _controller,
                  curve: Curves.elasticOut,
                ),
                child: FadeTransition(
                  opacity: CurvedAnimation(
                    parent: _controller,
                    curve: Curves.easeOut,
                  ),
                  child: Container(
                    width: 84,
                    height: 84,
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(120),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(0xFFF6B8A8),
                        width: 1.5,
                      ),
                    ),
                    child: Container(
                      margin: const EdgeInsets.all(9),
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.check_circle_outline,
                        color: AppColors.mint,
                        size: 34,
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                right: -4,
                bottom: 2,
                child: Container(
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    color: AppColors.coral,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.send, size: 14, color: Colors.white),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const AppPill(
            'BOOKING STATUS',
            background: Colors.white,
            foreground: AppColors.ink,
            dot: true,
            mono: true,
            fontSize: 10.5,
          ),
          const SizedBox(height: 14),
          Text(
            _confirmed ? 'Reservation Confirmed' : 'Reservation Pending',
            textAlign: TextAlign.center,
            style: AppText.title(27),
          ),
          const SizedBox(height: 8),
          Text(
            _confirmed
                ? 'The booking service confirmed your one-seat reservation.'
                : 'Your reservation is waiting for confirmation.',
            textAlign: TextAlign.center,
            style: AppText.body(14.5, AppColors.ink.withAlpha(210)),
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.info_outline, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Payment information', style: AppText.label(14)),
                      Text(
                        'Review the operator’s payment terms for this trip.',
                        style: AppText.body(12.5, AppColors.ink.withAlpha(200)),
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
