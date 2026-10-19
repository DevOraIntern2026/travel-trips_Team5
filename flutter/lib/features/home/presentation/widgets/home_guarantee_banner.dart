import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';

class HomeGuaranteeBanner extends StatelessWidget {
  const HomeGuaranteeBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return SoftBox(
      color: AppColors.bannerSurface,
      padding: const EdgeInsets.all(14),
      radius: 18,
      child: Row(
        children: [
          const AppIconBox(
            Icons.shield_outlined,
            background: AppColors.primary,
            foreground: Colors.white,
            size: 46,
            radius: 23,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Live Seat Availability', style: AppText.label(14.5)),
                const SizedBox(height: 2),
                Text(
                  'Check the latest available seats before confirming your departure.',
                  style: AppText.body(12.5, AppColors.ink.withAlpha(200)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
