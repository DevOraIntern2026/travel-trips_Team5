import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_widgets.dart';

class HomeSearchRow extends StatelessWidget {
  const HomeSearchRow({
    super.key,
    required this.controller,
    required this.onChanged,
    required this.onFilter,
  });

  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onFilter;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: controller,
            onChanged: onChanged,
            style: AppText.body(14.5),
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.white,
              hintText: 'Where to next? (e.g. Dolomites, Kyoto)',
              hintStyle: AppText.body(14, AppColors.muted),
              prefixIcon: const Icon(Icons.search, color: AppColors.primary),
              contentPadding: const EdgeInsets.symmetric(vertical: 16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        SizedBox(
          width: 52,
          height: 52,
          child: IconButton.filledTonal(
            onPressed: onFilter,
            tooltip: 'Filter trips',
            icon: const Icon(Icons.tune, color: AppColors.primary),
          ),
        ),
      ],
    );
  }
}
