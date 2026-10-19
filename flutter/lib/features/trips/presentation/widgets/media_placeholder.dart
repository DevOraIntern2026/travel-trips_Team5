import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

class MediaPlaceholder extends StatelessWidget {
  const MediaPlaceholder({
    super.key,
    required this.seed,
    this.height,
    this.borderRadius,
    this.overlay,
    this.child,
    this.imageAsset,
  });

  final int seed;
  final double? height;
  final BorderRadius? borderRadius;
  final Gradient? overlay;
  final Widget? child;
  final String? imageAsset;

  @override
  Widget build(BuildContext context) {
    final palettes = <List<Color>>[
      const [Color(0xFF1F4E46), Color(0xFF6B8F71)],
      const [Color(0xFF163A4A), Color(0xFF4F7A8C)],
      const [Color(0xFF3D4A32), Color(0xFF8AA07A)],
      const [Color(0xFF2C3E50), Color(0xFF6D8B74)],
      const [Color(0xFF3B2F2F), Color(0xFF8B6B4F)],
    ];
    final colors = palettes[seed.abs() % palettes.length];
    final radius = borderRadius ?? BorderRadius.circular(18);

    return ClipRRect(
      borderRadius: radius,
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: Stack(
          fit: StackFit.expand,
          children: [
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: colors,
                ),
              ),
            ),
            if (imageAsset != null)
              Image.asset(
                imageAsset!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) =>
                    const SizedBox.shrink(),
              )
            else
              Align(
                alignment: Alignment.center,
                child: Icon(
                  Icons.landscape_rounded,
                  size: height != null && height! < 90 ? 28 : 46,
                  color: Colors.white.withValues(alpha: 0.28),
                ),
              ),
            if (overlay != null)
              DecoratedBox(decoration: BoxDecoration(gradient: overlay)),
            ?child,
          ],
        ),
      ),
    );
  }
}

class StatusPill extends StatelessWidget {
  const StatusPill({
    super.key,
    required this.label,
    required this.color,
    this.icon,
    this.filled = true,
  });

  final String label;
  final Color color;
  final IconData? icon;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: filled ? color : Colors.white.withValues(alpha: 0.92),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: filled ? Colors.white : color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              color: filled ? Colors.white : color,
              fontSize: 10.5,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class ForestChip extends StatelessWidget {
  const ForestChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.leading,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final Widget? leading;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
        decoration: BoxDecoration(
          color: selected ? AppColors.forest : AppColors.chip,
          borderRadius: BorderRadius.circular(22),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (leading != null) ...[leading!, const SizedBox(width: 6)],
            Text(
              label,
              style: TextStyle(
                color: selected ? Colors.white : AppColors.ink,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
            if (selected) ...[
              const SizedBox(width: 6),
              const Icon(Icons.check, size: 14, color: Colors.white),
            ],
          ],
        ),
      ),
    );
  }
}
