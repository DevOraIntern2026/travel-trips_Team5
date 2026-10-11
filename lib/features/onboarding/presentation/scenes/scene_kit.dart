import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

/// Shared building blocks for the code-drawn onboarding scenes.
///
/// Every scene is authored on a virtual 1000 × 1800 canvas and scaled with
/// "cover" semantics, so it fills any screen (phones, tall phones, tablets,
/// landscape) without distortion. Anything that should bleed off-screen is
/// drawn up to the visible bounds passed as `view`.

const double kVirtualWidth = 1000;
const double kVirtualHeight = 1800;
const double _tau = math.pi * 2;

/// Looping sine. [cycles] MUST be an integer so the loop is seamless when the
/// ambient controller (t: 0 → 1) restarts.
double wave(double t, int cycles, [double phase = 0]) =>
    math.sin((t * cycles + phase) * _tau);

double fract(double v) => v - v.floorToDouble();

Paint paintOf(Color color) => Paint()..color = color;

abstract class VirtualScenePainter extends CustomPainter {
  VirtualScenePainter(this.ambient) : super(repaint: ambient);

  /// Looping 0 → 1 animation that drives all idle motion.
  final Animation<double> ambient;

  /// Draw the scene in virtual coordinates. [view] is the visible part of the
  /// virtual canvas (it can extend beyond 0…1000 × 0…1800 on odd aspect ratios).
  void paintScene(Canvas canvas, Rect view, double t);

  @override
  void paint(Canvas canvas, Size size) {
    final scale = math.max(size.width / kVirtualWidth, size.height / kVirtualHeight);
    final dx = (size.width - kVirtualWidth * scale) / 2;
    final dy = (size.height - kVirtualHeight * scale) / 2;
    canvas.save();
    canvas.clipRect(Offset.zero & size);
    canvas.translate(dx, dy);
    canvas.scale(scale);
    final view = Rect.fromLTRB(
      -dx / scale,
      -dy / scale,
      (size.width - dx) / scale,
      (size.height - dy) / scale,
    );
    paintScene(canvas, view, ambient.value);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant VirtualScenePainter oldDelegate) =>
      oldDelegate.ambient != ambient;
}

// ───────────────────────────── Atmosphere ─────────────────────────────

void drawVerticalGradient(
  Canvas c,
  Rect rect,
  List<Color> colors, [
  List<double>? stops,
]) {
  c.drawRect(
    rect,
    Paint()
      ..shader = ui.Gradient.linear(
        rect.topCenter,
        rect.bottomCenter,
        colors,
        stops,
      ),
  );
}

void drawGlow(Canvas c, Offset center, double radius, Color color) {
  c.drawCircle(
    center,
    radius,
    Paint()
      ..shader = ui.Gradient.radial(center, radius, [
        color,
        color.withValues(alpha: 0),
      ]),
  );
}

const _puffs = <(double, double, double)>[
  (-0.62, 0.10, 0.34),
  (-0.22, -0.12, 0.48),
  (0.28, -0.06, 0.44),
  (0.68, 0.10, 0.34),
  (0.05, 0.14, 0.42),
];

/// Soft cloud with a lighter top and a slightly darker underside.
void drawCloud(
  Canvas c,
  Offset o,
  double s, {
  required Color color,
  required Color shade,
}) {
  for (final layer in [(shade, s * 0.07), (color, 0.0)]) {
    final paint = paintOf(layer.$1);
    final dy = layer.$2;
    c.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
          center: o.translate(0, s * 0.20 + dy),
          width: s * 1.9,
          height: s * 0.45,
        ),
        Radius.circular(s * 0.22),
      ),
      paint,
    );
    for (final p in _puffs) {
      c.drawCircle(o.translate(p.$1 * s, p.$2 * s + dy), p.$3 * s, paint);
    }
  }
}

/// Rolling hills filled down past the bottom of the view.
void drawRidge(
  Canvas c,
  Rect view, {
  required double baseY,
  required double amp,
  required double freq,
  required double phase,
  required Color top,
  required Color bottom,
}) {
  final path = Path()..moveTo(view.left - 20, view.bottom + 40);
  for (double x = view.left - 20; x <= view.right + 20; x += 10) {
    final u = x * freq;
    final y =
        baseY -
        amp * (0.5 + 0.5 * math.sin(u + phase)) -
        amp * 0.35 * math.sin(u * 2.3 + phase * 1.7);
    path.lineTo(x, y);
  }
  path
    ..lineTo(view.right + 20, view.bottom + 40)
    ..close();
  c.drawPath(
    path,
    Paint()
      ..shader = ui.Gradient.linear(
        Offset(0, baseY - amp),
        Offset(0, baseY + amp * 2.2),
        [top, bottom],
      ),
  );
}

// ───────────────────────────── Sparkles & birds ─────────────────────────────

void drawSparkle(Canvas c, Offset p, double r, Color color) {
  final path = Path()
    ..moveTo(p.dx, p.dy - r)
    ..quadraticBezierTo(p.dx, p.dy, p.dx + r, p.dy)
    ..quadraticBezierTo(p.dx, p.dy, p.dx, p.dy + r)
    ..quadraticBezierTo(p.dx, p.dy, p.dx - r, p.dy)
    ..quadraticBezierTo(p.dx, p.dy, p.dx, p.dy - r)
    ..close();
  c.drawPath(path, paintOf(color));
}

void drawBird(Canvas c, Offset p, double s, double flap, Color color) {
  final path = Path()
    ..moveTo(p.dx - s, p.dy + flap * s * 0.5)
    ..quadraticBezierTo(p.dx - s * 0.5, p.dy - s * 0.35, p.dx, p.dy)
    ..quadraticBezierTo(
      p.dx + s * 0.5,
      p.dy - s * 0.35,
      p.dx + s,
      p.dy + flap * s * 0.5,
    );
  c.drawPath(
    path,
    Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = math.max(3, s * 0.14)
      ..color = color,
  );
}

// ───────────────────────────── Vegetation ─────────────────────────────

/// A deterministic row of round bushes (same seed → same shape every frame).
void drawBushes(
  Canvas c, {
  required double x0,
  required double x1,
  required double baseY,
  required double minR,
  required double maxR,
  required Color color,
  required Color highlight,
  required int seed,
  double spacing = 0.7,
}) {
  final rnd = math.Random(seed);
  final body = paintOf(color);
  final light = paintOf(highlight);
  var x = x0;
  while (x <= x1) {
    final r = minR + (maxR - minR) * rnd.nextDouble();
    final y = baseY + (rnd.nextDouble() - 0.6) * r * 0.7;
    c.drawCircle(Offset(x, y), r, body);
    c.drawCircle(Offset(x - r * 0.28, y - r * 0.32), r * 0.52, light);
    x += r * spacing;
  }
}

/// A leaf / fern blade pointing along [angle] (radians, 0 = +x).
void drawLeaf(
  Canvas c,
  Offset origin,
  double length,
  double angle,
  double width,
  Color color,
) {
  c.save();
  c.translate(origin.dx, origin.dy);
  c.rotate(angle);
  final path = Path()
    ..moveTo(0, 0)
    ..quadraticBezierTo(length * 0.5, -width, length, 0)
    ..quadraticBezierTo(length * 0.5, width * 0.35, 0, 0)
    ..close();
  c.drawPath(path, paintOf(color));
  c.restore();
}

/// Fan of leaves growing from [origin]; [sway] (radians) animates them.
void drawLeafFan(
  Canvas c,
  Offset origin, {
  required int count,
  required double length,
  required double fromAngle,
  required double toAngle,
  required double width,
  required Color color,
  required Color altColor,
  required double sway,
  required int seed,
}) {
  final rnd = math.Random(seed);
  for (var i = 0; i < count; i++) {
    final f = count == 1 ? 0.5 : i / (count - 1);
    final angle = fromAngle + (toAngle - fromAngle) * f + sway * (0.6 + 0.4 * f);
    final len = length * (0.7 + 0.3 * rnd.nextDouble());
    drawLeaf(c, origin, len, angle, width, i.isEven ? color : altColor);
  }
}

void drawPine(Canvas c, Offset base, double height, Color color) {
  final p = paintOf(color);
  final width = height * 0.5;
  for (var i = 0; i < 4; i++) {
    final top = base.dy - height + i * height * 0.2;
    final bottom = base.dy - height * (1 - (i + 1) * 0.24) + height * 0.06;
    final half = width * (0.34 + i * 0.2) / 2 + width * 0.06;
    c.drawPath(
      Path()
        ..moveTo(base.dx, top)
        ..lineTo(base.dx + half, bottom)
        ..lineTo(base.dx - half, bottom)
        ..close(),
      p,
    );
  }
  c.drawRect(
    Rect.fromLTWH(base.dx - width * 0.04, base.dy - height * 0.12, width * 0.08, height * 0.14),
    p,
  );
}

void drawCypress(Canvas c, Offset base, double height, Color color) {
  final w = height * 0.18;
  c.drawPath(
    Path()
      ..moveTo(base.dx, base.dy - height)
      ..quadraticBezierTo(base.dx + w, base.dy - height * 0.55, base.dx + w * 0.7, base.dy)
      ..lineTo(base.dx - w * 0.7, base.dy)
      ..quadraticBezierTo(base.dx - w, base.dy - height * 0.55, base.dx, base.dy - height)
      ..close(),
    paintOf(color),
  );
}

void drawHouse(Canvas c, Offset base, double w, double h, Color wall, Color roof) {
  c.drawRect(Rect.fromLTWH(base.dx - w / 2, base.dy - h, w, h), paintOf(wall));
  c.drawRect(
    Rect.fromLTWH(base.dx + w * 0.1, base.dy - h, w * 0.4, h),
    paintOf(const Color(0x1A000000)),
  );
  c.drawPath(
    Path()
      ..moveTo(base.dx - w * 0.6, base.dy - h)
      ..lineTo(base.dx, base.dy - h - w * 0.38)
      ..lineTo(base.dx + w * 0.6, base.dy - h)
      ..close(),
    paintOf(roof),
  );
  c.drawRect(
    Rect.fromLTWH(base.dx - w * 0.14, base.dy - h * 0.62, w * 0.2, h * 0.3),
    paintOf(const Color(0x66704A2E)),
  );
}

// ───────────────────────────── Paths & markers ─────────────────────────────

void drawDashed(
  Canvas c,
  Path path,
  Paint paint, {
  required double dash,
  required double gap,
  double offset = 0,
}) {
  for (final metric in path.computeMetrics()) {
    var d = -offset;
    while (d < metric.length) {
      final start = math.max(0.0, d);
      final end = math.min(d + dash, metric.length);
      if (end > start) c.drawPath(metric.extractPath(start, end), paint);
      d += dash + gap;
    }
  }
}

/// Map-pin marker whose tip sits at [tip].
void drawPin(Canvas c, Offset tip, double r, Color color) {
  final head = Offset(tip.dx, tip.dy - r * 1.9);
  final shape = Path.combine(
    PathOperation.union,
    Path()..addOval(Rect.fromCircle(center: head, radius: r)),
    Path()..addPolygon([
      Offset(head.dx - r * 0.82, head.dy + r * 0.55),
      Offset(head.dx + r * 0.82, head.dy + r * 0.55),
      tip,
    ], true),
  );
  c.drawPath(shape, paintOf(color));
  c.drawPath(
    shape,
    Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = r * 0.16
      ..color = Colors.white,
  );
  c.drawCircle(head, r * 0.42, paintOf(Colors.white));
}

// ───────────────────────────── Hot-air balloon ─────────────────────────────

void drawBalloon(
  Canvas c,
  Offset center,
  double r, {
  required List<Color> colors, // [base, alternate, band]
  required double rotation,
  required double flicker,
  bool passengers = false,
}) {
  c.save();
  c.translate(center.dx, center.dy);
  c.rotate(rotation);

  final envelope = Path.combine(
    PathOperation.union,
    Path()..addOval(Rect.fromCircle(center: Offset.zero, radius: r)),
    Path()..addPolygon([
      Offset(-r * 0.62, r * 0.78),
      Offset(r * 0.62, r * 0.78),
      Offset(r * 0.30, r * 1.20),
      Offset(-r * 0.30, r * 1.20),
    ], true),
  );

  // Ropes
  final rope = Paint()
    ..color = const Color(0xFF5B4630)
    ..strokeWidth = math.max(1.5, r * 0.018);
  for (final x in [-0.30, -0.10, 0.10, 0.30]) {
    c.drawLine(
      Offset(r * x, r * 1.2),
      Offset(r * x * 0.78, r * 1.52),
      rope,
    );
  }

  if (passengers) {
    for (final person in [
      (-0.08, AppColors.forest, const Color(0xFFF2C9A0)),
      (0.09, const Color(0xFFF7F8F7), const Color(0xFFE0A87C)),
    ]) {
      c.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromCenter(center: Offset(r * person.$1, r * 1.50), width: r * 0.13, height: r * 0.14),
          Radius.circular(r * 0.04),
        ),
        paintOf(person.$2),
      );
      c.drawCircle(Offset(r * person.$1, r * 1.43), r * 0.055, paintOf(person.$3));
    }
  }

  // Basket
  final basket = RRect.fromRectAndRadius(
    Rect.fromLTWH(-r * 0.23, r * 1.52, r * 0.46, r * 0.28),
    Radius.circular(r * 0.05),
  );
  c.drawRRect(basket, paintOf(const Color(0xFF9A6A3A)));
  c.save();
  c.clipRRect(basket);
  final weave = Paint()
    ..color = const Color(0xFF7A4F26)
    ..strokeWidth = math.max(1, r * 0.014);
  for (var i = 1; i < 4; i++) {
    final y = r * 1.52 + r * 0.07 * i;
    c.drawLine(Offset(-r * 0.23, y), Offset(r * 0.23, y), weave);
  }
  for (var i = -3; i <= 3; i++) {
    c.drawLine(Offset(r * 0.06 * i, r * 1.52), Offset(r * 0.06 * i, r * 1.80), weave);
  }
  c.restore();
  c.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromLTWH(-r * 0.25, r * 1.50, r * 0.50, r * 0.05),
      Radius.circular(r * 0.02),
    ),
    paintOf(const Color(0xFF7A4F26)),
  );

  // Burner flame
  final f = 1 + 0.18 * flicker;
  final base = r * 1.43;
  final hgt = r * 0.2 * f;
  drawGlow(c, Offset(0, base - hgt * 0.4), r * 0.2, const Color(0x66FFB547));
  final flame = Path()
    ..moveTo(0, base - hgt)
    ..cubicTo(r * 0.07, base - hgt * 0.4, r * 0.06, base, 0, base)
    ..cubicTo(-r * 0.06, base, -r * 0.07, base - hgt * 0.4, 0, base - hgt);
  c.drawPath(flame, paintOf(const Color(0xFFFF8A1F)));
  c.save();
  c.translate(0, base);
  c.scale(0.55);
  c.translate(0, -base);
  c.drawPath(flame, paintOf(const Color(0xFFFFE08A)));
  c.restore();

  // Envelope
  c.save();
  c.clipPath(envelope);
  c.drawRect(Rect.fromCircle(center: Offset.zero, radius: r * 1.5), paintOf(colors[0]));
  const ks = [0.80, 0.56, 0.30];
  for (var i = 0; i < ks.length; i++) {
    c.drawOval(
      Rect.fromCenter(center: Offset(0, r * 0.05), width: r * 2 * ks[i], height: r * 2.5),
      paintOf(colors[i.isEven ? 1 : 0]),
    );
  }
  c.drawRect(Rect.fromLTRB(-r, r * 0.52, r, r * 0.64), paintOf(colors[2]));
  final seam = Paint()
    ..style = PaintingStyle.stroke
    ..strokeWidth = 1.5
    ..color = const Color(0x14000000);
  for (final k in [1.0, ...ks]) {
    c.drawOval(
      Rect.fromCenter(center: Offset(0, r * 0.05), width: r * 2 * k, height: r * 2.5),
      seam,
    );
  }
  c.drawRect(
    Rect.fromCircle(center: Offset.zero, radius: r * 1.5),
    Paint()
      ..shader = ui.Gradient.linear(
        Offset(-r, 0),
        Offset(r, 0),
        [const Color(0x33FFFFFF), const Color(0x00FFFFFF), const Color(0x2E000000)],
        [0, 0.45, 1],
      ),
  );
  c.restore();

  c.restore();
}
