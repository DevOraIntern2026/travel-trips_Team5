import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/auth_colors.dart';
import 'travelora_logo.dart';

/// Header used on Login / Register: back, logo, title, (lock | close), avatar.
class AuthTopBar extends StatelessWidget {
  const AuthTopBar({
    super.key,
    required this.title,
    this.eyebrow,
    this.showLock = false,
    this.showClose = false,
  });

  final String title;
  final String? eyebrow;
  final bool showLock;
  final bool showClose;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(8, 8, 12, 8),
      decoration: const BoxDecoration(
        color: Color(0xFFF8F9FD),
        border: Border(bottom: BorderSide(color: AuthColors.border)),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: () => Navigator.of(context).maybePop(),
            icon: const Icon(Icons.arrow_back, color: AuthColors.ink),
          ),
          const TravelOraCompactLogo(
            badgeSize: 30,
            wordSize: 14,
            showTagline: false,
          ),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (eyebrow != null)
                  Text(
                    eyebrow!,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      letterSpacing: 1,
                      fontWeight: FontWeight.w500,
                      color: AuthColors.muted,
                    ),
                  ),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AuthColors.ink,
                  ),
                ),
              ],
            ),
          ),
          if (showLock)
            Container(
              width: 44,
              height: 44,
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(
                color: AuthColors.mint,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(
                Icons.lock_outline,
                color: AuthColors.primary,
                size: 22,
              ),
            ),
          if (showClose)
            const Padding(
              padding: EdgeInsets.only(right: 8),
              child: Icon(Icons.close, color: AuthColors.ink, size: 22),
            ),
          Container(
            width: 38,
            height: 38,
            decoration: const BoxDecoration(
              color: AuthColors.primary,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.person_outline,
              color: Colors.white,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }
}
