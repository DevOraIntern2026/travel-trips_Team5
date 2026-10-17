import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/utils/currency_format.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../utils/booking_display.dart';

/// Unit price, total and the no-payment-today note.
class ReviewFareCard extends StatelessWidget {
  const ReviewFareCard({super.key, required this.unitPrice});

  final double unitPrice;

  /// Seat count is always 1: the API claims exactly one seat per booking.
  double get total => unitPrice;
  @override
  Widget build(BuildContext context) {
    final unit = unitPrice;

    return AppCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.receipt_long_outlined,
                size: 22,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Expanded(child: Text('Fare Breakdown', style: AppText.title(17))),
              AppPill(
                '1 seat',
                background: AppColors.errorSurface,
                foreground: AppColors.error,
                mono: true,
                fontSize: 10.5,
              ),
            ],
          ),
          const SizedBox(height: 12),
          AppInfoRow(
            'Trip price (${formatMoney(unit)} × 1 seat)',
            formatMoneyExact(total),
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Trip price', style: AppText.title(15.5)),
                    Text(
                      'Final payment terms depend on the operator.',
                      style: AppText.body(11.5, AppColors.ink.withAlpha(190)),
                    ),
                  ],
                ),
              ),
              Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: formatMoney(total),
                      style: AppText.mono(
                        25,
                        AppColors.primary,
                        FontWeight.w700,
                      ),
                    ),
                    TextSpan(
                      text: ' USD',
                      style: AppText.mono(
                        16,
                        AppColors.primary,
                        FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SoftBox(
            color: AppColors.infoSurface,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.info_outline, size: 15),
                    const SizedBox(width: 6),
                    Text('Payment information', style: AppText.label(12.5)),
                  ],
                ),
                const SizedBox(height: 6),
                Text.rich(
                  TextSpan(
                    style: AppText.body(12.5, AppColors.ink.withAlpha(220)),
                    children: [
                      const TextSpan(
                        text:
                            'The app does not collect payment. Review the operator’s payment terms before booking.',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
