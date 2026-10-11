import 'package:flutter/material.dart';

import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/utils/currency_format.dart';
import '../../../../../core/widgets/app_widgets.dart';
import '../../../data/models/booking_model.dart';
import '../../utils/booking_display.dart';

/// Price breakdown and no-payment-today note.
class BookingDetailsFinancial extends StatelessWidget {
  const BookingDetailsFinancial({
    super.key,
    required this.booking,
    required this.status,
  });

  final BookingModel booking;
  final String status;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(16),
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
              Expanded(
                child: Text('Financial Summary', style: AppText.title(17)),
              ),
              AppPill(
                status,
                background: AppColors.infoSurface,
                foreground: AppColors.ink,
                mono: true,
                fontSize: 10,
              ),
            ],
          ),
          const SizedBox(height: 12),
          AppInfoRow('Reservation total', formatMoneyExact(booking.price)),
          const SizedBox(height: 6),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Total Payable', style: AppText.title(16)),
                    Text(
                      'Price returned by the booking service',
                      style: AppText.body(11.5, AppColors.ink.withAlpha(190)),
                    ),
                  ],
                ),
              ),
              Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: formatMoney(booking.price),
                      style: AppText.title(28, AppColors.primary),
                    ),
                    TextSpan(text: '  USD', style: AppText.mono(11)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SoftBox(
            color: AppColors.infoSurface,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.credit_card_off_outlined,
                  size: 20,
                  color: AppColors.primary,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text.rich(
                    TextSpan(
                      style: AppText.body(12.5, AppColors.ink.withAlpha(220)),
                      children: [
                        TextSpan(
                          text: 'Payment terms: ',
                          style: AppText.label(12.5),
                        ),
                        const TextSpan(
                          text: 'Check the operator’s terms for this trip.',
                        ),
                      ],
                    ),
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
