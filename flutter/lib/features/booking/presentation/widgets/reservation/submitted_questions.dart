import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Support contact block shown under the roadmap.
class SubmittedQuestions extends StatelessWidget {
  const SubmittedQuestions({super.key});
  @override
  Widget build(BuildContext context) {
    return SoftBox(
      color: AppColors.bannerSurface,
      padding: const EdgeInsets.all(14),
      radius: 18,
      child: Row(
        children: [
          const AppIconBox(
            Icons.headset_mic_outlined,
            background: AppColors.bannerIconSurface,
            size: 44,
            radius: 22,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Questions about this route?', style: AppText.label(14.5)),
                Text(
                  'Chat with the operator concierge',
                  style: AppText.body(12.5, AppColors.ink.withAlpha(200)),
                ),
              ],
            ),
          ),
          FilledButton(
            onPressed: () {
              // TODO: open chat
            },
            style: FilledButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.ink,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Text('Chat', style: AppText.label(13)),
          ),
        ],
      ),
    );
  }
}
