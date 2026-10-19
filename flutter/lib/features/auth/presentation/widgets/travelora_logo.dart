import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/auth_colors.dart';

TextSpan _wordmark(double fontSize) {
  final base = GoogleFonts.plusJakartaSans(
    fontSize: fontSize,
    fontWeight: FontWeight.w800,
    letterSpacing: -0.5,
    height: 1,
  );
  return TextSpan(
    children: [
      TextSpan(
        text: 'Travel',
        style: base.copyWith(color: AuthColors.primary),
      ),
      TextSpan(
        text: 'Ora',
        style: base.copyWith(color: AuthColors.brandOrange),
      ),
    ],
  );
}

/// Big logo used on the splash screen: round "T" mark + wordmark + tagline.
class TravelOraLogo extends StatelessWidget {
  const TravelOraLogo({
    super.key,
    this.markSize = 84,
    this.tagline = 'DISCOVER YOUR WORLD',
  });

  final double markSize;
  final String tagline;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        TravelOraMark(size: markSize),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text.rich(_wordmark(markSize * 0.46)),
            const SizedBox(height: 6),
            Text(
              tagline,
              style: GoogleFonts.plusJakartaSans(
                fontSize: markSize * 0.125,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.4,
                color: AuthColors.brandBlue,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

/// Round teal "T" with a dashed orbit and an orange dot.
class TravelOraMark extends StatelessWidget {
  const TravelOraMark({super.key, this.size = 84});

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size * 1.2,
      height: size,
      child: CustomPaint(painter: _MarkPainter()),
    );
  }
}

class _MarkPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final r = size.height * 0.44;

    // dashed orbit
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(-0.3);
    final orbit = Path()
      ..addOval(
        Rect.fromCenter(
          center: Offset.zero,
          width: size.width * 0.98,
          height: size.height * 0.6,
        ),
      );
    final orbitPaint = Paint()
      ..color = AuthColors.brandBlue
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.height * 0.018;
    _drawDashed(canvas, orbit, orbitPaint, size.height * 0.05);
    canvas.restore();

    // circle
    canvas.drawCircle(center, r, Paint()..color = AuthColors.primary);

    // "T"
    final white = Paint()..color = Colors.white;
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(
          center.dx - r * 0.58,
          center.dy - r * 0.5,
          r * 1.16,
          r * 0.24,
        ),
        Radius.circular(r * 0.12),
      ),
      white,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(
          center.dx - r * 0.12,
          center.dy - r * 0.5,
          r * 0.24,
          r * 0.82,
        ),
        Radius.circular(r * 0.1),
      ),
      white,
    );

    // orange arrow under the stem
    final arrow = Path()
      ..moveTo(center.dx, center.dy + r * 0.42)
      ..lineTo(center.dx + r * 0.2, center.dy + r * 0.8)
      ..lineTo(center.dx, center.dy + r * 0.68)
      ..lineTo(center.dx - r * 0.2, center.dy + r * 0.8)
      ..close();
    canvas.drawPath(arrow, Paint()..color = AuthColors.brandOrange);

    // orange dot
    canvas.drawCircle(
      Offset(size.width * 0.93, size.height * 0.27),
      size.height * 0.04,
      Paint()..color = AuthColors.brandOrange,
    );
  }

  void _drawDashed(Canvas canvas, Path path, Paint paint, double dash) {
    for (final metric in path.computeMetrics()) {
      var distance = 0.0;
      while (distance < metric.length) {
        canvas.drawPath(
          metric.extractPath(
            distance,
            math.min(distance + dash, metric.length),
          ),
          paint,
        );
        distance += dash * 1.9;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Small logo used in headers/cards: rounded teal badge + wordmark.
class TravelOraCompactLogo extends StatelessWidget {
  const TravelOraCompactLogo({
    super.key,
    this.badgeSize = 32,
    this.wordSize = 16,
    this.showTagline = true,
    this.tagline = 'DISCOVER & BOOK',
  });

  final double badgeSize;
  final double wordSize;
  final bool showTagline;
  final String tagline;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: badgeSize,
          height: badgeSize,
          decoration: BoxDecoration(
            color: AuthColors.primary,
            borderRadius: BorderRadius.circular(badgeSize * 0.3),
          ),
          child: CustomPaint(painter: _BadgePainter()),
        ),
        SizedBox(width: badgeSize * 0.22),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text.rich(_wordmark(wordSize)),
            if (showTagline) ...[
              const SizedBox(height: 3),
              Text(
                tagline,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: wordSize * 0.42,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.6,
                  color: AuthColors.primary.withAlpha(150),
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }
}

class _BadgePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final peak = Path()
      ..moveTo(w * 0.5, h * 0.2)
      ..lineTo(w * 0.78, h * 0.62)
      ..lineTo(w * 0.22, h * 0.62)
      ..close();
    canvas.drawPath(peak, Paint()..color = Colors.white);

    final arrow = Path()
      ..moveTo(w * 0.5, h * 0.55)
      ..lineTo(w * 0.6, h * 0.78)
      ..lineTo(w * 0.5, h * 0.7)
      ..lineTo(w * 0.4, h * 0.78)
      ..close();
    canvas.drawPath(arrow, Paint()..color = AuthColors.brandOrange);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
