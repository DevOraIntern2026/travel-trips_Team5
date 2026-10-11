import 'package:flutter/material.dart';

class AppColors {
  const AppColors._();

  static const Color primary = Color(0xFF0F3D3E);
  static const Color primaryLight = Color(0xFF1B5A5B);
  static const Color rust = Color(0xFFA8391A);
  static const Color coral = Color(0xFFFF6B4A);
  static const Color brandOrange = Color(0xFFE5532D);
  static const Color brandBlue = Color(0xFF2B8FD6);
  static const Color navy = Color(0xFF0F172A);
  static const Color ink = Color(0xFF0F1B2D);
  static const Color muted = Color(0xFF6B7280);
  static const Color background = Color(0xFFF4F6FB);
  static const Color field = Color(0xFFEEF0FB);
  static const Color infoSurface = Color(0xFFE4EAFD);
  static const Color mint = Color(0xFFCFF1EA);
  static const Color mintSoft = Color(0xFFE3F5F1);
  static const Color border = Color(0xFFE3E8F4);
  static const Color barOff = Color(0xFFD5DCF3);
  static const Color success = Color(0xFF1C7A5B);
  static const Color error = Color(0xFFB0492B);
  static const Color errorSurface = Color(0xFFFFE9E3);
  static const Color warn = Color(0xFF9A6A00);
  static const Color warnSurface = Color(0xFFFFEFC2);

  // --- Named for the places that previously inlined the hex value. ---
  // Same values as before; only the repetition was removed.

  /// Warm amber surface behind "pending" status pills.
  static const Color pendingSurface = Color(0xFFFFE2D4);

  /// Foreground that pairs with [pendingSurface].
  static const Color pendingText = Color(0xFFB0360F);

  /// A slightly hotter orange, used on the availability pills.
  static const Color pendingTextStrong = Color(0xFFC2410C);

  /// Softer lavender used by the informational banners.
  static const Color bannerSurface = Color(0xFFE9EEFD);

  /// Icon-tile background inside the informational banners.
  static const Color bannerIconSurface = Color(0xFFD3DCF7);

  /// Pale blue surface behind the light-blue informational panels.
  static const Color infoPanelSurface = Color(0xFFD6E6FB);

  /// Foreground that pairs with [infoPanelSurface].
  static const Color infoPanelText = Color(0xFF1D4E89);
}
