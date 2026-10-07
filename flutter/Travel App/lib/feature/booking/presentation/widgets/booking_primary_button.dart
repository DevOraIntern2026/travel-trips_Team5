import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_spacing.dart';

class BookingPrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isLoading;

  const BookingPrimaryButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: BookingSpacing.buttonHeight,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: BookingColors.accent,
          foregroundColor: BookingColors.surface,
          disabledBackgroundColor: BookingColors.textMuted,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(BookingSpacing.buttonRadius),
          ),
        ),
        child: isLoading
            ? const SizedBox(
                height: 22,
                width: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  color: BookingColors.surface,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(text, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  if (icon != null) ...[
                    const SizedBox(width: BookingSpacing.sm),
                    Icon(icon, size: 20),
                  ],
                ],
              ),
      ),
    );
  }
}