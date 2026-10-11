import 'package:flutter/material.dart';

import '../../feature/auth/presentation/widgets/travelora_logo.dart';
import '../theme/app_colors.dart';
import 'app_widgets.dart';

/// Header used across the booking flow and tabs:
/// [back] [logo] [eyebrow + title] [actions] [avatar]
class FlowTopBar extends StatelessWidget {
  const FlowTopBar({
    super.key,
    required this.title,
    this.eyebrow,
    this.showBack = true,
    this.showLogoTagline = true,
    this.showAvatar = true,
    this.actions = const [],
  });

  final String title;
  final String? eyebrow;
  final bool showBack;
  final bool showLogoTagline;
  final bool showAvatar;
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(showBack ? 8 : 16, 8, 14, 8),
      decoration: const BoxDecoration(
        color: Color(0xFFF8F9FD),
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        children: [
          if (showBack)
            IconButton(
              onPressed: () => Navigator.of(context).maybePop(),
              icon: const Icon(Icons.arrow_back, color: AppColors.ink),
            ),
          TravelOraCompactLogo(
            badgeSize: 30,
            wordSize: 14,
            showTagline: showLogoTagline,
          ),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (eyebrow != null)
                  Text(
                    eyebrow!,
                    textAlign: TextAlign.center,
                    style: AppText.label(
                      10,
                      AppColors.muted,
                      FontWeight.w500,
                    ).copyWith(letterSpacing: 1),
                  ),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.title(16),
                ),
              ],
            ),
          ),
          ...actions,
          if (showAvatar) ...[
            const SizedBox(width: 8),
            Container(
              width: 38,
              height: 38,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person_outline,
                color: Colors.white,
                size: 20,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class TopBarIcon extends StatelessWidget {
  const TopBarIcon(this.icon, {super.key, this.onTap, this.dot = false});

  final IconData icon;
  final VoidCallback? onTap;
  final bool dot;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      customBorder: const CircleBorder(),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Icon(icon, color: AppColors.ink, size: 24),
            if (dot)
              Positioned(
                right: -1,
                top: -1,
                child: Container(
                  width: 9,
                  height: 9,
                  decoration: BoxDecoration(
                    color: AppColors.rust,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
