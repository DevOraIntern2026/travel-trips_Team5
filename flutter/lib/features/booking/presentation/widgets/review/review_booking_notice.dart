import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Mint notice explaining what happens on submit.
class ReviewBookingNotice extends StatelessWidget {
  const ReviewBookingNotice({super.key});
  @override
  Widget build(BuildContext context) {
    return SoftBox(
      color: AppColors.mintSoft,
      padding: const EdgeInsets.all(14),
      radius: 18,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppIconBox(
            Icons.receipt_long_outlined,
            background: AppColors.primary,
            foreground: Colors.white,
            size: 44,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'One seat per reservation',
                  style: AppText.title(16, AppColors.primary),
                ),
                const SizedBox(height: 4),
                Text(
                  'The booking service accepts the selected departure and account. Payment is not handled in this booking flow.',
                  style: AppText.body(13, AppColors.ink.withAlpha(220)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
