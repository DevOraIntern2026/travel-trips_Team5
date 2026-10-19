import 'package:flutter/material.dart';

import '../../../../../core/di/service_locator.dart';
import '../../../../../core/storage/token_storage.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';
import 'review_info_row.dart';

/// Lead-traveler summary with seat count.
class ReviewTravelerCard extends StatelessWidget {
  const ReviewTravelerCard({super.key});
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: getIt<TokenStorage>().getUser(),
      builder: (context, snapshot) {
        final user = snapshot.data;
        final name = user?.name?.trim();
        final displayName = name == null || name.isEmpty
            ? 'Account holder'
            : name;

        return AppCard(
          padding: const EdgeInsets.all(14),
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
                        Text('Traveler Details', style: AppText.title(17)),
                        Text(
                          'Lead traveler • 1 seat',
                          style: AppText.body(12.5, AppColors.muted),
                        ),
                      ],
                    ),
                  ),
                  const AppPill(
                    'Primary',
                    background: AppColors.infoSurface,
                    foreground: AppColors.ink,
                    fontSize: 10.5,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ReviewInfoRow(Icons.person_outline, 'Lead traveler', displayName),
              const SizedBox(height: 8),
              ReviewInfoRow(
                Icons.email_outlined,
                'Account email',
                user?.email ?? '—',
              ),
              const SizedBox(height: 10),
              Text(
                'Traveler details come from the signed-in account.',
                style: AppText.body(12, AppColors.muted),
              ),
            ],
          ),
        );
      },
    );
  }
}
