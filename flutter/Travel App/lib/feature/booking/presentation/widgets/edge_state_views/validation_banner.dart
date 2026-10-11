import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/utils/text_format.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Matrix state 03 - banner shown above the form when fields need review.
/// Matrix state 03 — banner shown above the form when fields need review.
class ValidationBanner extends StatelessWidget {
  const ValidationBanner({super.key, required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return SoftBox(
      color: AppColors.errorSurface,
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: AppColors.error, size: 22),
          const SizedBox(width: 10),
          Expanded(
            child: Text.rich(
              TextSpan(
                style: AppText.body(13, AppColors.ink.withAlpha(220)),
                children: [
                  TextSpan(
                    text: '${plural(count, 'field')} require review. ',
                    style: AppText.label(13, AppColors.ink),
                  ),
                  const TextSpan(
                    text: 'Your entered data is securely preserved.',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
