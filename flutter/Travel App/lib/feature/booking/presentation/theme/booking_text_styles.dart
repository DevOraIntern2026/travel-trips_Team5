import 'package:flutter/material.dart';

import 'booking_colors.dart';

class BookingTextStyles {
  const BookingTextStyles._();

  static const TextStyle appBarTitle = TextStyle(fontWeight: FontWeight.w800);

  static const TextStyle screenTitle = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle sectionTitle = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle cardTitle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle displayNumber = TextStyle(
    fontSize: 26,
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle metricValue = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle cardMetric = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle bodyStrong = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle body = TextStyle(
    color: BookingColors.primary,
    height: 1.35,
  );

  static const TextStyle bodyEmphasis = TextStyle(
    fontWeight: FontWeight.w800,
    color: BookingColors.primary,
  );

  static const TextStyle chipLabel = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w800,
  );

  static const TextStyle caption = TextStyle(
    fontSize: 12,
    color: BookingColors.textMuted,
  );

  static const TextStyle captionEmphasis = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w700,
    color: BookingColors.textMuted,
  );

  static const TextStyle muted = TextStyle(
    fontSize: 13,
    color: BookingColors.textMuted,
  );

  static const TextStyle microLabel = TextStyle(
    fontSize: 11,
    letterSpacing: 1.2,
    color: BookingColors.textMuted,
  );
}
