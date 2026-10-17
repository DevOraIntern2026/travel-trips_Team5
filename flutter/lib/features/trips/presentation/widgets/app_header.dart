import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../auth/presentation/widgets/travelora_logo.dart';

class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  const AppHeader({
    super.key,
    this.notificationCount = 1,
    this.onBellTap,
    this.onProfileTap,
  });

  final int notificationCount;
  final VoidCallback? onBellTap;
  final VoidCallback? onProfileTap;

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 6, 16, 8),
          child: Row(
            children: [
              const TravelOraCompactLogo(
                badgeSize: 34,
                wordSize: 14,
                showTagline: true,
              ),
              const Spacer(),
              const Spacer(),
              _RoundIcon(
                icon: Icons.notifications_none_rounded,
                badge: notificationCount,
                onTap: onBellTap ?? () => context.go('/alerts'),
              ),
              const SizedBox(width: 8),
              _RoundIcon(
                icon: Icons.person_outline_rounded,
                filled: true,
                onTap: onProfileTap ?? () => context.go('/profile'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoundIcon extends StatelessWidget {
  const _RoundIcon({
    required this.icon,
    this.badge,
    this.filled = false,
    this.onTap,
  });

  final IconData icon;
  final int? badge;
  final bool filled;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: filled ? AppColors.forest : Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.border),
            ),
            child: Icon(
              icon,
              size: 20,
              color: filled ? Colors.white : AppColors.forest,
            ),
          ),
          if (badge != null && badge! > 0)
            Positioned(
              right: -1,
              top: -1,
              child: Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  color: AppColors.danger,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 1.5),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
