import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/storage/token_storage.dart';
import '../../../../core/router/app_router.dart' show BookingRouteData;
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_sticky_bottom_bar.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../../core/widgets/flow_top_bar.dart';
import '../../../home/data/models/trip_model.dart';
import '../../data/models/trip_date_model.dart';
import '../utils/booking_display.dart';
import '../utils/booking_formatters.dart';

/// Traveler details step styled after the supplied reservation screens.
/// Only profile fields supported by the current booking API are displayed.
class PassengerDetailsScreen extends StatelessWidget {
  const PassengerDetailsScreen({
    super.key,
    required this.tripId,
    required this.dateId,
    required this.date,
    this.trip,
  });

  final int tripId;
  final int dateId;
  final TripDateModel date;
  final TripModel? trip;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            const FlowTopBar(
              eyebrow: 'RESERVATION FLOW',
              title: 'Guest Details',
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 24),
                children: [
                  _progress(),
                  const SizedBox(height: 14),
                  _tripSummary(),
                  const SizedBox(height: 14),
                  _leadTraveler(),
                  const SizedBox(height: 14),
                  _operatorNotice(),
                ],
              ),
            ),
            _bottomBar(context),
          ],
        ),
      ),
    );
  }

  Widget _progress() {
    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 26,
                height: 26,
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                child: Text('2', style: AppText.label(12, Colors.white)),
              ),
              const SizedBox(width: 8),
              Text('Guest Details', style: AppText.title(16)),
              const Spacer(),
              Text('STEP 2 OF 3', style: AppText.mono(10.5)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: List.generate(
              3,
              (index) => Expanded(
                child: Container(
                  height: 5,
                  margin: EdgeInsets.only(right: index == 2 ? 0 : 5),
                  decoration: BoxDecoration(
                    color: index < 2 ? AppColors.primary : AppColors.barOff,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _tripSummary() {
    return AppCard(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          TripImage(url: trip?.imageUrl, width: 62, height: 62, radius: 12),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  trip?.title ?? 'Trip #$tripId',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.title(16),
                ),
                const SizedBox(height: 3),
                Text(
                  '${formatBookingRange(date.startDate, date.endDate)} â€¢ 1 traveler',
                  style: AppText.body(12, AppColors.ink.withAlpha(200)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            formatMoney(date.price),
            style: AppText.mono(14, AppColors.primary),
          ),
        ],
      ),
    );
  }

  Widget _leadTraveler() {
    return FutureBuilder(
      future: getIt<TokenStorage>().getUser(),
      builder: (context, snapshot) {
        final user = snapshot.data;
        final fullName = user?.name?.trim();
        final name = fullName == null || fullName.isEmpty
            ? 'Account holder'
            : fullName;

        return AppCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const AppIconBox(
                    Icons.badge_outlined,
                    background: AppColors.mintSoft,
                    size: 40,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Lead Traveler', style: AppText.title(17)),
                        Text(
                          'Primary booking account',
                          style: AppText.body(12, AppColors.muted),
                        ),
                      ],
                    ),
                  ),
                  const AppPill(
                    'You',
                    background: AppColors.primary,
                    foreground: Colors.white,
                  ),
                ],
              ),
              const SizedBox(height: 14),
              _profileField('Full name', name, Icons.person_outline),
              const SizedBox(height: 10),
              _profileField(
                'Email address',
                user?.email ?? 'â€”',
                Icons.mail_outline,
              ),
              const SizedBox(height: 12),
              Text(
                'This booking is for the signed-in account. The booking service does not currently accept separate traveler, emergency-contact, or meal-preference details.',
                style: AppText.body(12, AppColors.muted),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _profileField(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppText.body(11.5, AppColors.ink.withAlpha(200))),
        const SizedBox(height: 4),
        SoftBox(
          color: AppColors.infoSurface,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 13),
          radius: 12,
          child: Row(
            children: [
              Icon(icon, size: 17, color: AppColors.primary),
              const SizedBox(width: 9),
              Expanded(child: Text(value, style: AppText.body(14))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _operatorNotice() {
    return SoftBox(
      color: AppColors.infoSurface,
      padding: const EdgeInsets.all(14),
      radius: 16,
      child: Row(
        children: [
          const AppIconBox(
            Icons.verified_user_outlined,
            background: AppColors.mint,
            size: 40,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              'Your account information will be used for this reservation.',
              style: AppText.body(12.5, AppColors.ink.withAlpha(220)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _bottomBar(BuildContext context) {
    return AppStickyBottomBar(
      topPadding: 10,
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(formatMoney(date.price), style: AppText.title(22)),
                Text('1 traveler', style: AppText.body(11.5, AppColors.muted)),
              ],
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            height: 54,
            child: FilledButton.icon(
              onPressed: () => context.push(
                '/trips/$tripId/booking',
                extra: BookingRouteData(
                  tripId: tripId,
                  dateId: dateId,
                  date: date,
                  trip: trip,
                ),
              ),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.coral,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              icon: const Icon(Icons.arrow_forward_rounded, size: 18),
              label: Text(
                'Continue to Review',
                style: AppText.label(14, Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
