import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../cubit/availability_cubit.dart';
import '../../cubit/availability_state.dart';
import '../../../data/models/availability_model.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/utils/text_format.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// ⚠️ RECONSTRUCTION PLACEHOLDER — RESTORE THE ORIGINAL UI.
///
/// The original `_travelerNotice()` in `availability_screen.dart` was lost
/// during a file split and could not be recovered: the repository only holds
/// an older 168-line revision of that file, and the working copy was never
/// committed. This stand-in keeps the layout flowing (icon + explanation above
/// the month selector) but is **not** the original design. Replace this file
/// with the real one.
class AvailabilityTravelerNotice extends StatelessWidget {
  const AvailabilityTravelerNotice({super.key});

  @override
  Widget build(BuildContext context) {
    final availability = context.select<AvailabilityCubit, AvailabilityModel?>((
      c,
    ) {
      final state = c.state;
      return state is AvailabilitySuccess ? state.availability : null;
    });

    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          const AppIconBox(
            Icons.groups_outlined,
            background: AppColors.infoPanelSurface,
            size: 40,
            radius: 20,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Select Number of Travelers', style: AppText.label(14)),
                const SizedBox(height: 2),
                Text(
                  availability == null
                      ? 'Checking seat availability…'
                      : 'Up to ${plural(availability.remainingSeats, 'traveler')} on this departure.',
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
