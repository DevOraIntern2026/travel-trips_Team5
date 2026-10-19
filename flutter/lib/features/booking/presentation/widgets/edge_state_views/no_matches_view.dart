import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Matrix state 02 - filters/search returned nothing.
/// Matrix state 02 — filters/search returned nothing.
class NoMatchesView extends StatelessWidget {
  const NoMatchesView({
    super.key,
    this.filters = const [],
    required this.onReset,
  });

  final List<String> filters;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 74,
                height: 74,
                decoration: const BoxDecoration(
                  color: AppColors.infoSurface,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.location_off_outlined,
                  size: 34,
                  color: AppColors.primary,
                ),
              ),
              Positioned(
                right: -2,
                bottom: -2,
                child: Container(
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    color: AppColors.coral,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: const Icon(
                    Icons.search,
                    size: 14,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            'No Verified Departures Match Exactly',
            textAlign: TextAlign.center,
            style: AppText.title(19),
          ),
          const SizedBox(height: 8),
          Text(
            'None of the available trips match this combination of filters.',
            textAlign: TextAlign.center,
            style: AppText.body(13.5, AppColors.ink.withAlpha(200)),
          ),
          if (filters.isNotEmpty) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: [
                for (final f in filters)
                  AppPill(
                    '$f  ✕',
                    background: AppColors.infoSurface,
                    foreground: AppColors.ink,
                    mono: true,
                  ),
              ],
            ),
          ],
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: FilledButton.icon(
              onPressed: onReset,
              icon: const Icon(Icons.auto_awesome, size: 18),
              label: Text(
                'Relax Filters & View All',
                style: AppText.label(14.5, Colors.white),
              ),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.rust,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          TextButton(
            onPressed: onReset,
            child: Text('Reset All Filters', style: AppText.label(13)),
          ),
        ],
      ),
    );
  }
}
