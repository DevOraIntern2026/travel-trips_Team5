import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';

class AppText {
  const AppText._();

  static TextStyle title([double size = 22, Color color = AppColors.ink]) =>
      GoogleFonts.plusJakartaSans(
        fontSize: size,
        fontWeight: FontWeight.w800,
        height: 1.2,
        color: color,
      );

  static TextStyle body([
    double size = 14,
    Color color = AppColors.ink,
    FontWeight weight = FontWeight.w400,
  ]) => GoogleFonts.plusJakartaSans(
    fontSize: size,
    fontWeight: weight,
    height: 1.4,
    color: color,
  );

  static TextStyle label([
    double size = 13,
    Color color = AppColors.ink,
    FontWeight weight = FontWeight.w700,
  ]) => GoogleFonts.plusJakartaSans(
    fontSize: size,
    fontWeight: weight,
    color: color,
  );

  static TextStyle mono([
    double size = 12,
    Color color = AppColors.muted,
    FontWeight weight = FontWeight.w500,
  ]) => GoogleFonts.jetBrainsMono(
    fontSize: size,
    fontWeight: weight,
    color: color,
  );
}

class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.color = Colors.white,
    this.radius = 20,
    this.shadow = true,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final Color color;
  final double radius;
  final bool shadow;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: padding,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
        boxShadow: shadow
            ? [
                BoxShadow(
                  color: AppColors.primary.withAlpha(12),
                  blurRadius: 20,
                  offset: const Offset(0, 6),
                ),
              ]
            : null,
      ),
      child: child,
    );
  }
}

class SoftBox extends StatelessWidget {
  const SoftBox({
    super.key,
    required this.child,
    this.color = AppColors.infoSurface,
    this.padding = const EdgeInsets.all(12),
    this.radius = 14,
  });

  final Widget child;
  final Color color;
  final EdgeInsetsGeometry padding;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: padding,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
      ),
      child: child,
    );
  }
}

class AppPill extends StatelessWidget {
  const AppPill(
    this.label, {
    super.key,
    this.background = AppColors.infoSurface,
    this.foreground = AppColors.primary,
    this.icon,
    this.dot = false,
    this.mono = false,
    this.fontSize = 11.5,
  });

  final String label;
  final Color background;
  final Color foreground;
  final IconData? icon;
  final bool dot;
  final bool mono;
  final double fontSize;

  @override
  Widget build(BuildContext context) {
    final style = mono
        ? AppText.mono(fontSize, foreground, FontWeight.w600)
        : AppText.label(fontSize, foreground);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (dot) ...[
            Container(
              width: 7,
              height: 7,
              decoration: BoxDecoration(
                color: foreground,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
          ],
          if (icon != null) ...[
            Icon(icon, size: fontSize + 3, color: foreground),
            const SizedBox(width: 5),
          ],
          Flexible(
            child: Text(label, style: style, overflow: TextOverflow.ellipsis),
          ),
        ],
      ),
    );
  }
}

class AppIconBox extends StatelessWidget {
  const AppIconBox(
    this.icon, {
    super.key,
    this.background = AppColors.infoSurface,
    this.foreground = AppColors.primary,
    this.size = 42,
    this.radius = 12,
  });

  final IconData icon;
  final Color background;
  final Color foreground;
  final double size;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(radius),
      ),
      child: Icon(icon, size: size * 0.5, color: foreground),
    );
  }
}

class SectionTitle extends StatelessWidget {
  const SectionTitle(this.title, {super.key, this.icon, this.trailing});

  final String title;
  final IconData? icon;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        if (icon != null) ...[
          Icon(icon, size: 22, color: AppColors.primary),
          const SizedBox(width: 8),
        ],
        Expanded(child: Text(title, style: AppText.title(18))),
        ?trailing,
      ],
    );
  }
}

/// Label on the left, monospaced value on the right.
///
/// Used by every "summary" card (price breakdowns, reservation totals,
/// payment details). Previously each screen re-declared the same local
/// `row(label, value)` closure.
class AppInfoRow extends StatelessWidget {
  const AppInfoRow(this.label, this.value, {super.key, this.bottomPadding = 8});

  final String label;
  final String value;
  final double bottomPadding;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: bottomPadding),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: AppText.body(13, AppColors.ink.withAlpha(220)),
            ),
          ),
          Text(
            value,
            style: AppText.mono(12.5, AppColors.ink, FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

/// Network image with a teal gradient placeholder (used when the API gives no
/// image or it fails to load).
class TripImage extends StatelessWidget {
  const TripImage({
    super.key,
    this.url,
    this.width,
    this.height,
    this.radius = 16,
    this.child,
  });

  final String? url;
  final double? width;
  final double? height;
  final double radius;
  final Widget? child;

  Widget _placeholder() {
    return const DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF3B6E70), AppColors.primary],
        ),
      ),
      child: Center(
        child: Icon(Icons.terrain, color: Color(0x66FFFFFF), size: 40),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasUrl = url != null && url!.isNotEmpty;

    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: SizedBox(
        width: width,
        height: height,
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (hasUrl && url!.startsWith('assets/'))
              Image.asset(
                url!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => _placeholder(),
              )
            else if (hasUrl)
              Image.network(
                url!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => _placeholder(),
                loadingBuilder: (context, child, progress) =>
                    progress == null ? child : _placeholder(),
              )
            else
              _placeholder(),
            ?child,
          ],
        ),
      ),
    );
  }
}
