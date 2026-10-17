import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Icon + label + value row used inside the review cards.
class ReviewInfoRow extends StatelessWidget {
  const ReviewInfoRow(this.icon, this.label, this.value, {super.key});

  final IconData icon;
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) {
    return SoftBox(
      color: const Color(0xFFEFF1FB),
      padding: const EdgeInsets.all(10),
      child: Row(
        children: [
          AppIconBox(
            icon,
            background: AppColors.infoSurface,
            size: 40,
            radius: 10,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppText.body(11.5, AppColors.ink.withAlpha(190)),
                ),
                Text(value, style: AppText.title(15.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
