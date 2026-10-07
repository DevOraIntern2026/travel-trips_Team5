import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';
import '../theme/booking_text_styles.dart';

class BookingInfoCard extends StatelessWidget {
  final String? title;
  final Color? color;
  final List<Widget> children;

  const BookingInfoCard({
    super.key,
    this.title,
    this.color,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: BookingSpacing.cardPadding,
      decoration: BoxDecoration(
        color: color ?? BookingColors.surface,
        borderRadius: BorderRadius.circular(BookingSpacing.cardRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title != null) ...[
            Text(title!, style: BookingTextStyles.cardTitle),
            const SizedBox(height: BookingSpacing.md),
          ],
          ...children,
        ],
      ),
    );
  }
}

class BookingInfoRow extends StatelessWidget {
  final String label;
  final String value;

  const BookingInfoRow({super.key, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: BookingTextStyles.muted),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: BookingTextStyles.bodyEmphasis,
          ),
        ),
      ],
    );
  }
}

class BookingSectionTitle extends StatelessWidget {
  final String text;

  const BookingSectionTitle(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: BookingSpacing.xs, bottom: BookingSpacing.md),
      child: Text(text, style: BookingTextStyles.sectionTitle),
    );
  }
}