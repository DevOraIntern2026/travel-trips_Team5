import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// "Step 2 of 4" progress header.
class ReviewStepCard extends StatelessWidget {
  const ReviewStepCard({super.key});
  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(14),
      radius: 18,
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
                child: Text('3', style: AppText.label(12.5, Colors.white)),
              ),
              const SizedBox(width: 8),
              Text('STEP 3 OF 3', style: AppText.mono(11.5, AppColors.ink)),
              const Spacer(),
              const AppPill(
                'Ready to book',
                background: AppColors.mint,
                foreground: AppColors.primary,
                dot: true,
                mono: true,
                fontSize: 10.5,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: Text('Review & Confirm', style: AppText.title(21)),
              ),
              Text(
                '1 seat',
                style: AppText.label(
                  12,
                  AppColors.ink.withAlpha(200),
                  FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: List.generate(
              3,
              (i) => Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: i == 2 ? 0 : 6),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
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
}
