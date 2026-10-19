import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/widgets/app_widgets.dart';

/// Terms checkbox that gates the "Confirm Booking" button.
///
/// ⚠️ RECONSTRUCTION PLACEHOLDER — RESTORE THE ORIGINAL UI.
///
/// The original `_agreementCard()` in `review_and_confirm_view.dart` was lost
/// during a file split and could not be recovered: the repository only holds
/// an older 82-line revision of that file, and the working copy was never
/// committed. This widget is a minimal stand-in that keeps the flow working
/// (the confirm button stays disabled until the box is ticked), but it is
/// **not** the original design. Replace this file with the real one.
class ReviewAgreementCard extends StatelessWidget {
  const ReviewAgreementCard({
    super.key,
    required this.agreed,
    required this.onChanged,
  });

  final bool agreed;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Checkbox(
            value: agreed,
            onChanged: (v) => onChanged(v ?? false),
            visualDensity: VisualDensity.compact,
          ),
          const SizedBox(width: 4),
          Expanded(
            child: Text(
              'I have read and accept the operator terms and the direct '
              'reservation policy for this trip.',
              style: AppText.body(12.5, AppColors.ink.withAlpha(210)),
            ),
          ),
        ],
      ),
    );
  }
}
