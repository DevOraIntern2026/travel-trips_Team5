import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Small statistic card (max elevation, cancellation policy).
class TermCard extends StatelessWidget {
  const TermCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: AppColors.primary),
          const SizedBox(height: 8),
          Text(label, style: AppText.mono(9.5, AppColors.muted)),
          const SizedBox(height: 4),
          Text(value, style: AppText.title(14)),
        ],
      ),
    );
  }
}
