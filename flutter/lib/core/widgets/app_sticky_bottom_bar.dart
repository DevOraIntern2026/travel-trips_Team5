import 'package:flutter/material.dart';

/// White bar pinned to the bottom of the booking flow screens
/// (availability, passenger details, review) holding the running total and the
/// primary call to action. `topPadding` differs slightly per screen and is
/// exposed rather than hard-coded.
class AppStickyBottomBar extends StatelessWidget {
  const AppStickyBottomBar({
    super.key,
    required this.child,
    this.topPadding = 12,
  });

  final Widget child;
  final double topPadding;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(16, topPadding, 16, 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Color(0x0E000000),
            blurRadius: 16,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(top: false, child: child),
    );
  }
}
