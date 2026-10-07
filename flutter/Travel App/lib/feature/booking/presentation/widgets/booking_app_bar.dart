import 'package:flutter/material.dart';

import '../theme/booking_colors.dart';
import '../theme/booking_text_styles.dart';

class BookingAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final Color background;
  final Color foreground;

  const BookingAppBar(
    this.title, {
    super.key,
    this.background = BookingColors.surface,
    this.foreground = BookingColors.primary,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: background,
      foregroundColor: foreground,
      elevation: 0,
      title: Text(title, style: BookingTextStyles.appBarTitle),
    );
  }
}