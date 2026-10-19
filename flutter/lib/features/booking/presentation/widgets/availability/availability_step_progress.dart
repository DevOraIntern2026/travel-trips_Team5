import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// "Step 2 of 4" progress header.
class AvailabilityStepProgress extends StatelessWidget {
  const AvailabilityStepProgress({super.key});
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'STEP 2 OF 4 • DATES & SEATS',
              style: AppText.mono(11.5, AppColors.ink),
            ),
            Text(
              '50% Complete',
              style: AppText.mono(11.5, AppColors.primary, FontWeight.w700),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: const LinearProgressIndicator(
            value: 0.5,
            minHeight: 5,
            backgroundColor: AppColors.barOff,
            valueColor: AlwaysStoppedAnimation(AppColors.primary),
          ),
        ),
      ],
    );
  }
}
