import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';

/// Seat quantity stepper used in the traveler step.
class SeatStepper extends StatelessWidget {
  const SeatStepper({super.key, required this.icon, required this.enabled});

  final IconData icon;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 42,
      height: 42,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Icon(icon, color: enabled ? AppColors.primary : AppColors.muted),
    );
  }
}
