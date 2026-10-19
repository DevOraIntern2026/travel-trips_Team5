import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

const double _tau = math.pi * 2;

/// Looping sine. [cycles] MUST be an integer so the loop is seamless when the
/// ambient controller (t: 0 → 1) restarts.
double _wave(double t, int cycles, [double phase = 0]) =>
    math.sin((t * cycles + phase) * _tau);

double _fract(double v) => v - v.floorToDouble();

/// The big animated illustration area of the onboarding.
///
/// Everything is drawn with a single [CustomPainter] (no assets needed):
///  * [page]    – fractional page position (0.0 … 2.0) driven by the PageView,
///                used for parallax, cross-fades and the background gradient.
///  * [ambient] – a looping 0 → 1 animation driving the idle motion
///                (bobbing, waves, clouds, flame, flag…).
class OnboardingStage extends StatelessWidget {
  const OnboardingStage({super.key, required this.page, required this.ambient});

  final ValueListenable<double> page;
  final Animation<double> ambient;

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: AnimatedBuilder(
        animation: Listenable.merge([page, ambient]),
        builder: (context, _) {
          return CustomPaint(
            size: Size.infinite,
            painter: _StagePainter(page.value, ambient.value),
          );
        },
      ),
    );
  }
}

class _StagePainter extends CustomPainter {
  _StagePainter(this.page, this.t);

  final double page;
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    canvas.save();
    canvas.clipRect(rect);
    _paintBackdrop(canvas, size, page);

    for (var i = 0; i < 3; i++) {
      final o = page - i; // -1 … 1 : scene position relative to the viewport
      final alpha = 1 - (o.abs() * 1.25).clamp(0.0, 1.0);
      if (alpha <= 0) continue;

      final fading = alpha < 0.999;
      if (fading) {
        canvas.saveLayer(
          rect,
          Paint()..color = Color.fromRGBO(255, 255, 255, alpha),
        );
      }
      switch (i) {
        case 0:
          _balloonScene(canvas, size, o, t);
        case 1:
          _seaScene(canvas, size, o, t);
        default:
          _mountainScene(canvas, size, o, t);
      }
      if (fading) canvas.restore();
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(_StagePainter old) => old.page != page || old.t != t;
}

// ───────────────────────────── Backdrop ─────────────────────────────

const _skyTop = [Color(0xFF7CC8EE), Color(0xFFFFA26B), Color(0xFF0A2C27)];
const _skyBottom = [Color(0xFFE6F5F1), Color(0xFFFFE3C8), Color(0xFF2A7566)];

void _paintBackdrop(Canvas canvas, Size size, double page) {
  final i = page.floor().clamp(0, 1);
  final f = (page - i).clamp(0.0, 1.0);
  final top = Color.lerp(_skyTop[i], _skyTop[i + 1], f)!;
  final bottom = Color.lerp(_skyBottom[i], _skyBottom[i + 1], f)!;
  canvas.drawRect(
    Offset.zero & size,
    Paint()
      ..shader = ui.Gradient.linear(
        Offset.zero,
        Offset(0, size.height),
        [top, bottom],
      ),
  );
}

// ───────────────────────────── Helpers ─────────────────────────────

void _cloud(Canvas c, Offset o, double s, Color color) {
  final p = Paint()..color = color;
  c.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: o.translate(0, s * 0.18),
        width: s * 2.0,
        height: s * 0.5,
      ),
      Radius.circular(s * 0.25),
    ),
    p,
  );
  c.drawCircle(o.translate(-s * 0.45, 0), s * 0.38, p);
  c.drawCircle(o.translate(s * 0.05, -s * 0.18), s * 0.5, p);
  c.drawCircle(o.translate(s * 0.58, s * 0.02), s * 0.34, p);
}

void _driftingCloud(
  Canvas c,
  Size s, {
  required double base,
  required double y,
  required double size,
  required int cycles,
  required double shift,
  required double t,
  Color color = Colors.white,
}) {
  final span = s.width + size * 4;
  final x = _fract(base + t * cycles) * span - size * 2 + shift;
  _cloud(c, Offset(x, y), size, color);
}

void _ridge(
  Canvas c,
  Size s, {
  required double baseY,
  required double amp,
  required double freq,
  required double phase,
  required double shift,
  required Color color,
}) {
  final p = Path()..moveTo(-10, s.height + 10);
  for (double x = -10; x <= s.width + 10; x += 8) {
    final u = (x - shift) * freq;
    final y =
        baseY -
        amp * (0.5 + 0.5 * math.sin(u + phase)) -
        amp * 0.35 * math.sin(u * 2.3 + phase * 1.7);
    p.lineTo(x, y);
  }
  p
    ..lineTo(s.width + 10, s.height + 10)
    ..close();
  c.drawPath(p, Paint()..color = color);
}

void _waveLayer(
  Canvas c,
  Size s, {
  required double baseY,
  required double amp,
  required double length,
  required double phase,
  required Color color,
}) {
  final p = Path()..moveTo(-10, s.height + 10);
  for (double x = -10; x <= s.width + 10; x += 6) {
    p.lineTo(x, baseY + amp * math.sin(x / length * _tau + phase * _tau));
  }
  p
    ..lineTo(s.width + 10, s.height + 10)
    ..close();
  c.drawPath(p, Paint()..color = color);
}

void _glow(Canvas c, Offset center, double radius, Color color) {
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

// ───────────────────────────── Scene 1: balloons ─────────────────────────────

void _balloonScene(Canvas c, Size s, double o, double t) {
  final w = s.width, h = s.height;
  double dx(double depth) => -o * w * depth;

  // Sun
  final sun = Offset(w * 0.22 + dx(0.15), h * 0.20);
  _glow(c, sun, w * 0.24, const Color(0x66FFF6D0));
  c.drawCircle(sun, w * 0.07, Paint()..color = const Color(0xFFFFF4C2));

  // Far clouds
  _driftingCloud(c, s, base: 0.10, y: h * 0.16, size: w * 0.13, cycles: 1, shift: dx(0.35), t: t);
  _driftingCloud(c, s, base: 0.62, y: h * 0.30, size: w * 0.10, cycles: 1, shift: dx(0.35), t: t);

  // Layered hills
  _ridge(c, s, baseY: h * 0.78, amp: h * 0.10, freq: 0.010, phase: 0.6, shift: dx(0.30), color: const Color(0xFFB5DCD2));
  _ridge(c, s, baseY: h * 0.85, amp: h * 0.09, freq: 0.014, phase: 2.1, shift: dx(0.55), color: const Color(0xFF7DBDAD));

  // Small distant balloons
  final bob = _wave(t, 2);
  _balloon(
    c,
    Offset(w * 0.17 + dx(0.75), h * 0.34 + _wave(t, 3, 0.3) * h * 0.012),
    w * 0.07,
    const [AppColors.forestMid, Color(0xFFF7F8F7), Color(0xFF7DBDAD)],
    _wave(t, 2, 0.2) * 0.05,
    _wave(t, 24, 0.1),
    t,
  );
  _balloon(
    c,
    Offset(w * 0.86 + dx(0.65), h * 0.22 + _wave(t, 2, 0.7) * h * 0.012),
    w * 0.055,
    const [Color(0xFFF59E0B), Color(0xFFF7F8F7), AppColors.terracotta],
    _wave(t, 2, 0.6) * 0.05,
    _wave(t, 24, 0.5),
    t,
  );

  // Hero balloon
  final r = math.min(w * 0.30, h * 0.255);
  final heroCenter = Offset(
    w * 0.5 + dx(1.15),
    h * 0.07 + r + bob * h * 0.018 - math.max(o, 0) * h * 0.12,
  );
  _balloon(
    c,
    heroCenter,
    r,
    const [AppColors.terracotta, Color(0xFFF7F8F7), AppColors.forest],
    _wave(t, 1, 0.15) * 0.045,
    _wave(t, 24),
    t,
    hero: true,
  );

  // Near hill + passing cloud in front for depth
  _ridge(c, s, baseY: h * 0.93, amp: h * 0.08, freq: 0.018, phase: 4.0, shift: dx(0.9), color: AppColors.forestMid);
  _driftingCloud(c, s, base: 0.35, y: h * 0.80, size: w * 0.16, cycles: 2, shift: dx(1.3), t: t, color: const Color(0xFFFFFFFF));
}

void _balloon(
  Canvas c,
  Offset center,
  double r,
  List<Color> colors,
  double rotation,
  double flicker,
  double t, {
  bool hero = false,
}) {
  c.save();
  c.translate(center.dx, center.dy);
  c.rotate(rotation);

  // Envelope outline (circle + neck)
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
    ..strokeWidth = math.max(1, r * 0.018);
  c.drawLine(Offset(-r * 0.30, r * 1.2), Offset(-r * 0.23, r * 1.52), rope);
  c.drawLine(Offset(r * 0.30, r * 1.2), Offset(r * 0.23, r * 1.52), rope);
  c.drawLine(Offset(-r * 0.10, r * 1.2), Offset(-r * 0.09, r * 1.52), rope);
  c.drawLine(Offset(r * 0.10, r * 1.2), Offset(r * 0.09, r * 1.52), rope);

  // Passengers
  if (hero) {
    c.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(-r * 0.08, r * 1.50), width: r * 0.13, height: r * 0.14),
        Radius.circular(r * 0.04),
      ),
      Paint()..color = AppColors.forest,
    );
    c.drawCircle(Offset(-r * 0.08, r * 1.43), r * 0.055, Paint()..color = const Color(0xFFF2C9A0));
    c.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(r * 0.09, r * 1.50), width: r * 0.13, height: r * 0.14),
        Radius.circular(r * 0.04),
      ),
      Paint()..color = const Color(0xFFF7F8F7),
    );
    c.drawCircle(Offset(r * 0.09, r * 1.43), r * 0.055, Paint()..color = const Color(0xFFE0A87C));
  }

  // Basket
  final basket = RRect.fromRectAndRadius(
    Rect.fromLTWH(-r * 0.23, r * 1.52, r * 0.46, r * 0.28),
    Radius.circular(r * 0.05),
  );
  c.drawRRect(basket, Paint()..color = const Color(0xFF9A6A3A));
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
    Paint()..color = const Color(0xFF7A4F26),
  );

  // Burner flame
  final f = 1 + 0.18 * flicker;
  final base = r * 1.43;
  final hgt = r * 0.2 * f;
  _glow(c, Offset(0, base - hgt * 0.4), r * 0.2, const Color(0x66FFB547));
  final flame = Path()
    ..moveTo(0, base - hgt)
    ..cubicTo(r * 0.07, base - hgt * 0.4, r * 0.06, base, 0, base)
    ..cubicTo(-r * 0.06, base, -r * 0.07, base - hgt * 0.4, 0, base - hgt);
  c.drawPath(flame, Paint()..color = const Color(0xFFFF8A1F));
  c.save();
  c.translate(0, base);
  c.scale(0.55);
  c.translate(0, -base);
  c.drawPath(flame, Paint()..color = const Color(0xFFFFE08A));
  c.restore();

  // Envelope: base colour + gores
  c.save();
  c.clipPath(envelope);
  c.drawRect(
    Rect.fromCircle(center: Offset.zero, radius: r * 1.5),
    Paint()..color = colors[0],
  );
  const ks = [0.80, 0.56, 0.30];
  for (var i = 0; i < ks.length; i++) {
    c.drawOval(
      Rect.fromCenter(
        center: Offset(0, r * 0.05),
        width: r * 2 * ks[i],
        height: r * 2.5,
      ),
      Paint()..color = colors[i.isEven ? 1 : 0],
    );
  }
  // accent band
  c.drawRect(
    Rect.fromLTRB(-r, r * 0.52, r, r * 0.64),
    Paint()..color = colors[2],
  );
  // gore seams
  final seam = Paint()
    ..style = PaintingStyle.stroke
    ..strokeWidth = 1
    ..color = const Color(0x14000000);
  for (final k in [1.0, ...ks]) {
    c.drawOval(
      Rect.fromCenter(center: Offset(0, r * 0.05), width: r * 2 * k, height: r * 2.5),
      seam,
    );
  }
  // volume shading
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

// ───────────────────────────── Scene 2: sailing boat ─────────────────────────────

void _seaScene(Canvas c, Size s, double o, double t) {
  final w = s.width, h = s.height;
  double dx(double depth) => -o * w * depth;
  final horizon = h * 0.60;

  // Sun + glow
  final sun = Offset(w * 0.70 + dx(0.2), horizon - h * 0.05);
  _glow(c, sun, w * 0.38, const Color(0x80FFE9A8));
  c.drawCircle(sun, w * 0.12, Paint()..color = const Color(0xFFFFE9A8));

  // Clouds
  _driftingCloud(c, s, base: 0.15, y: h * 0.17, size: w * 0.12, cycles: 1, shift: dx(0.3), t: t, color: const Color(0xFFFFEEDD));
  _driftingCloud(c, s, base: 0.70, y: h * 0.30, size: w * 0.09, cycles: 1, shift: dx(0.3), t: t, color: const Color(0xFFFFEEDD));

  // Distant islands
  _ridge(c, s, baseY: horizon + 2, amp: h * 0.07, freq: 0.011, phase: 1.2, shift: dx(0.35), color: const Color(0xFFD9A48A));
  _ridge(c, s, baseY: horizon + 2, amp: h * 0.045, freq: 0.019, phase: 3.4, shift: dx(0.5), color: const Color(0xFFB7826E));

  // Sea
  c.drawRect(
    Rect.fromLTRB(0, horizon, w, h),
    Paint()
      ..shader = ui.Gradient.linear(
        Offset(0, horizon),
        Offset(0, h),
        [const Color(0xFF5CC2B5), const Color(0xFF0F6B63)],
      ),
  );

  // Sun reflection streaks
  for (var i = 0; i < 7; i++) {
    final y = horizon + h * 0.028 * (i + 1);
    final width = (w * 0.22 - i * w * 0.022) * (1 + 0.12 * _wave(t, 2, i * 0.13));
    c.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(sun.dx, y), width: width, height: h * 0.007),
        Radius.circular(h * 0.004),
      ),
      Paint()..color = const Color(0x66FFE9A8),
    );
  }

  // Seagulls
  for (var i = 0; i < 3; i++) {
    final x = _fract(0.2 + i * 0.28 + t * 1) * (w + 80) - 40 + dx(0.6 + i * 0.1);
    final y = h * (0.20 + 0.07 * i) + _wave(t, 2, i * 0.3) * h * 0.01;
    _bird(c, Offset(x, y), w * (0.030 - i * 0.004), _wave(t, 12 + i, i * 0.2));
  }

  // Back wave
  _waveLayer(c, s, baseY: horizon + h * 0.10, amp: h * 0.008, length: w * 0.45, phase: t * 1, color: const Color(0xFF3AA89C));

  // Boat
  final boatW = math.min(w * 0.62, h * 0.52);
  final bx = w * 0.46 + dx(1.1);
  final waterline = h * 0.755 + _wave(t, 3) * h * 0.010;

  // soft shadow on water
  c.drawOval(
    Rect.fromCenter(center: Offset(bx, waterline + boatW * 0.11), width: boatW * 1.1, height: boatW * 0.08),
    Paint()..color = const Color(0x330A2C27),
  );

  c.save();
  c.translate(bx, waterline);
  c.rotate(_wave(t, 3, 0.15) * 0.045);
  _sailBoat(c, boatW, t);
  c.restore();

  // Front waves (cover the hull bottom)
  _waveLayer(c, s, baseY: waterline + boatW * 0.07, amp: h * 0.012, length: w * 0.35, phase: -t * 2, color: const Color(0xFF1F8A80));
  _waveLayer(c, s, baseY: h * 0.88, amp: h * 0.016, length: w * 0.55, phase: t * 3, color: const Color(0xFF0F6B63));
}

void _bird(Canvas c, Offset p, double s, double flap) {
  final path = Path()
    ..moveTo(p.dx - s, p.dy + flap * s * 0.5)
    ..quadraticBezierTo(p.dx - s * 0.5, p.dy - s * 0.35, p.dx, p.dy)
    ..quadraticBezierTo(p.dx + s * 0.5, p.dy - s * 0.35, p.dx + s, p.dy + flap * s * 0.5);
  c.drawPath(
    path,
    Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 2
      ..color = const Color(0xB312211E),
  );
}

void _sailBoat(Canvas c, double w, double t) {
  const mastX = -0.02;
  final billow = 0.03 + _wave(t, 3, 0.2) * 0.02;

  // Mast
  c.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromLTRB(w * (mastX - 0.008), -w * 0.97, w * (mastX + 0.008), -w * 0.08),
      Radius.circular(w * 0.006),
    ),
    Paint()..color = const Color(0xFF5B4630),
  );

  // Main sail
  final main = Path()
    ..moveTo(w * (mastX + 0.02), -w * 0.92)
    ..quadraticBezierTo(w * (0.32 + billow), -w * 0.52, w * 0.44, -w * 0.17)
    ..lineTo(w * (mastX + 0.02), -w * 0.17)
    ..close();
  c.drawPath(
    main,
    Paint()
      ..shader = ui.Gradient.linear(
        Offset(0, -w * 0.5),
        Offset(w * 0.44, -w * 0.3),
        [Colors.white, const Color(0xFFE3ECE9)],
      ),
  );

  // Jib
  final jib = Path()
    ..moveTo(w * (mastX - 0.02), -w * 0.82)
    ..quadraticBezierTo(w * (-0.30 - billow), -w * 0.45, w * -0.50, -w * 0.15)
    ..lineTo(w * (mastX - 0.02), -w * 0.17)
    ..close();
  c.drawPath(jib, Paint()..color = AppColors.terracotta);

  // Flag
  final flag = Path()..moveTo(w * mastX, -w * 0.97);
  const steps = 8;
  for (var i = 0; i <= steps; i++) {
    final f = i / steps;
    flag.lineTo(
      w * mastX + f * w * 0.11,
      -w * 0.97 + _wave(t, 4, f * 0.35) * w * 0.012 * f,
    );
  }
  for (var i = steps; i >= 0; i--) {
    final f = i / steps;
    flag.lineTo(
      w * mastX + f * w * 0.11 * 0.85,
      -w * 0.93 + _wave(t, 4, f * 0.35) * w * 0.012 * f,
    );
  }
  flag.close();
  c.drawPath(flag, Paint()..color = AppColors.forest);

  // Hull
  final hull = Path()
    ..moveTo(-w * 0.52, -w * 0.10)
    ..lineTo(w * 0.56, -w * 0.10)
    ..quadraticBezierTo(w * 0.42, w * 0.12, w * 0.20, w * 0.14)
    ..lineTo(-w * 0.32, w * 0.14)
    ..quadraticBezierTo(-w * 0.46, w * 0.10, -w * 0.52, -w * 0.10)
    ..close();
  c.drawPath(hull, Paint()..color = const Color(0xFFF7F8F7));
  c.save();
  c.clipPath(hull);
  c.drawRect(Rect.fromLTRB(-w, -w * 0.10, w, -w * 0.045), Paint()..color = AppColors.terracotta);
  c.drawRect(Rect.fromLTRB(-w, w * 0.05, w, w), Paint()..color = AppColors.forest);
  c.restore();

  // Cabin
  c.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromLTWH(w * 0.14, -w * 0.19, w * 0.20, w * 0.09),
      Radius.circular(w * 0.015),
    ),
    Paint()..color = const Color(0xFFE7F1EE),
  );
  c.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromLTWH(w * 0.17, -w * 0.17, w * 0.06, w * 0.04),
      Radius.circular(w * 0.01),
    ),
    Paint()..color = AppColors.forestMid,
  );
}

// ───────────────────────────── Scene 3: mountain climbing ─────────────────────────────

final _stars = List.generate(46, (i) {
  final r = math.Random(i * 7 + 3);
  return (x: r.nextDouble(), y: r.nextDouble() * 0.5, r: 0.8 + r.nextDouble() * 1.6, p: r.nextDouble());
});

final _flakes = List.generate(36, (i) {
  final r = math.Random(i * 13 + 5);
  return (x: r.nextDouble(), y: r.nextDouble(), r: 1.2 + r.nextDouble() * 2.2, speed: 1 + r.nextInt(3), p: r.nextDouble());
});

void _mountainScene(Canvas c, Size s, double o, double t) {
  final w = s.width, h = s.height;
  double dx(double depth) => -o * w * depth;
  Offset pt(double x, double y) => Offset(x * w, y * h);

  // Stars
  for (var i = 0; i < _stars.length; i++) {
    final st = _stars[i];
    final a = 0.35 + 0.65 * (0.5 + 0.5 * _wave(t, 2 + i % 3, st.p));
    c.drawCircle(
      Offset(st.x * w + dx(0.2), st.y * h),
      st.r,
      Paint()..color = Color.fromRGBO(255, 255, 255, a),
    );
  }

  // Moon
  final moon = Offset(w * 0.18 + dx(0.15), h * 0.17);
  final mr = w * 0.065;
  _glow(c, moon, mr * 3.4, const Color(0x40FFF6D0));
  c.drawPath(
    Path.combine(
      PathOperation.difference,
      Path()..addOval(Rect.fromCircle(center: moon, radius: mr)),
      Path()..addOval(Rect.fromCircle(center: moon.translate(mr * 0.5, -mr * 0.2), radius: mr * 0.88)),
    ),
    Paint()..color = const Color(0xFFFFF4C2),
  );

  // Far range + secondary peak
  _ridge(c, s, baseY: h * 0.66, amp: h * 0.10, freq: 0.012, phase: 0.8, shift: dx(0.3), color: const Color(0xFF1E5F52));
  c.save();
  c.translate(dx(0.45), 0);
  final peak2 = Path()
    ..moveTo(-w * 0.10, h * 1.0)
    ..lineTo(w * 0.10, h * 0.50)
    ..lineTo(w * 0.15, h * 0.53)
    ..lineTo(w * 0.22, h * 0.40)
    ..lineTo(w * 0.46, h * 1.0)
    ..close();
  c.drawPath(peak2, Paint()..color = const Color(0xFF24705F));
  c.drawPath(
    Path()
      ..moveTo(w * 0.22, h * 0.40)
      ..lineTo(w * 0.185, h * 0.47)
      ..lineTo(w * 0.21, h * 0.455)
      ..lineTo(w * 0.235, h * 0.485)
      ..lineTo(w * 0.255, h * 0.455)
      ..lineTo(w * 0.27, h * 0.47)
      ..close(),
    Paint()..color = const Color(0xFFE8F1EE),
  );
  c.restore();

  // Main peak
  c.save();
  c.translate(dx(0.7), 0);
  final apex = pt(0.60, 0.16);
  final leftChain = [pt(0.53, 0.30), pt(0.48, 0.29), pt(0.38, 0.48), pt(0.32, 0.46), pt(0.15, 0.75), pt(-0.10, 0.95), pt(-0.10, 1.10)];
  final rightChain = [pt(0.66, 0.30), pt(0.70, 0.29), pt(0.80, 0.50), pt(0.86, 0.49), pt(1.00, 0.72), pt(1.15, 0.90), pt(1.15, 1.10)];
  final foot = pt(0.56, 1.10);

  final leftFace = Path()
    ..moveTo(apex.dx, apex.dy)
    ..addPolygon([...leftChain, foot], false)
    ..close();
  final rightFace = Path()
    ..moveTo(apex.dx, apex.dy)
    ..addPolygon([...rightChain, foot], false)
    ..close();
  c.drawPath(leftFace, Paint()..color = const Color(0xFF3C8F7F));
  c.drawPath(rightFace, Paint()..color = const Color(0xFF1B5C4F));

  // Snow cap
  final snow = Path()
    ..moveTo(apex.dx, apex.dy)
    ..lineTo(pt(0.53, 0.30).dx, pt(0.53, 0.30).dy)
    ..lineTo(pt(0.565, 0.355).dx, pt(0.565, 0.355).dy)
    ..lineTo(pt(0.595, 0.31).dx, pt(0.595, 0.31).dy)
    ..lineTo(pt(0.625, 0.37).dx, pt(0.625, 0.37).dy)
    ..lineTo(pt(0.66, 0.30).dx, pt(0.66, 0.30).dy)
    ..close();
  c.drawPath(snow, Paint()..color = const Color(0xFFF4F9F7));
  c.save();
  c.clipPath(rightFace);
  c.drawPath(snow, Paint()..color = const Color(0xFFC9DDD8));
  c.restore();

  // Climbing route
  final route = Path()
    ..moveTo(pt(0.30, 0.95).dx, pt(0.30, 0.95).dy);
  for (final p in [pt(0.46, 0.84), pt(0.34, 0.70), pt(0.50, 0.58), pt(0.40, 0.46), pt(0.55, 0.38), pt(0.575, 0.31), pt(0.598, 0.19)]) {
    route.lineTo(p.dx, p.dy);
  }
  final metric = route.computeMetrics().first;
  final progress = Curves.easeOutCubic.transform(1 - o.abs().clamp(0.0, 1.0));
  final climbed = metric.length * progress;

  final dash = Paint()
    ..style = PaintingStyle.stroke
    ..strokeWidth = 2
    ..strokeCap = StrokeCap.round
    ..color = const Color(0x66FFFFFF);
  for (double d = 0; d < metric.length; d += 14) {
    c.drawPath(metric.extractPath(d, math.min(d + 7, metric.length)), dash);
  }
  if (climbed > 1) {
    c.drawPath(
      metric.extractPath(0, climbed),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..color = AppColors.terracotta,
    );
  }

  // Summit flag
  final flagK = ((progress - 0.88) / 0.12).clamp(0.0, 1.0);
  if (flagK > 0) {
    final pole = h * 0.12 * flagK;
    final top = apex.translate(0, -pole);
    c.drawLine(apex, top, Paint()..color = const Color(0xFFF7F8F7)..strokeWidth = 2.5..strokeCap = StrokeCap.round);
    final fw = w * 0.12 * flagK;
    final fh = pole * 0.42;
    final flag = Path()..moveTo(top.dx, top.dy);
    const steps = 10;
    for (var i = 0; i <= steps; i++) {
      final f = i / steps;
      flag.lineTo(top.dx + f * fw, top.dy + _wave(t, 3, f * 0.4) * fh * 0.10 * f);
    }
    for (var i = steps; i >= 0; i--) {
      final f = i / steps;
      flag.lineTo(top.dx + f * fw * 0.9, top.dy + fh + _wave(t, 3, f * 0.4) * fh * 0.10 * f);
    }
    flag.close();
    c.drawPath(flag, Paint()..color = AppColors.terracotta);
  }

  // Climber
  final tangent = metric.getTangentForOffset(climbed);
  if (tangent != null) {
    final dir = tangent.vector.dx >= 0 ? 1.0 : -1.0;
    _climber(c, tangent.position, w * 0.042, dir, t, progress < 0.98);
  }
  c.restore();

  // Drifting mist
  final mistX = _wave(t, 1) * w * 0.05;
  for (final m in [(y: 0.70, d: 0.9, a: 0.16), (y: 0.84, d: 1.1, a: 0.20)]) {
    final center = Offset(w * 0.5 + mistX + dx(m.d), h * m.y);
    c.drawOval(
      Rect.fromCenter(center: center, width: w * 1.3, height: h * 0.12),
      Paint()..color = Color.fromRGBO(255, 255, 255, m.a),
    );
  }

  // Foreground pines + ground
  c.save();
  c.translate(dx(1.25), 0);
  const trees = [
    (x: 0.03, h: 0.30), (x: 0.11, h: 0.38), (x: 0.19, h: 0.26),
    (x: 0.80, h: 0.27), (x: 0.88, h: 0.38), (x: 0.96, h: 0.30),
  ];
  for (final tr in trees) {
    _pine(c, Offset(tr.x * w, h * 1.02), tr.h * h, const Color(0xFF0A2C27));
  }
  c.restore();
  _ridge(c, s, baseY: h * 0.95, amp: h * 0.05, freq: 0.016, phase: 1.0, shift: dx(1.25), color: const Color(0xFF081F1B));

  // Snowfall
  for (final f in _flakes) {
    final y = _fract(f.y + t * f.speed) * h;
    final x = f.x * w + _wave(t, 2, f.p) * 10 + dx(0.9);
    c.drawCircle(Offset(x, y), f.r, Paint()..color = const Color(0xCCFFFFFF));
  }
}

void _pine(Canvas c, Offset base, double height, Color color) {
  final p = Paint()..color = color;
  final width = height * 0.46;
  for (var i = 0; i < 3; i++) {
    final top = base.dy - height + i * height * 0.26;
    final bottom = base.dy - height * (1 - (i + 1) * 0.30) + height * 0.08;
    final half = width * (0.45 + i * 0.28) / 2 + width * 0.1;
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
    Rect.fromLTWH(base.dx - width * 0.05, base.dy - height * 0.12, width * 0.10, height * 0.14),
    p,
  );
}

void _climber(Canvas c, Offset feet, double u, double dir, double t, bool moving) {
  c.save();
  c.translate(feet.dx, feet.dy);
  c.scale(dir, 1);

  final swing = moving ? _wave(t, 10) : 0.0;
  final dark = Paint()
    ..color = const Color(0xFF12211E)
    ..strokeWidth = u * 0.30
    ..strokeCap = StrokeCap.round;

  // legs
  c.drawLine(Offset(0, -u * 1.1), Offset(u * 0.35 + swing * u * 0.25, 0), dark);
  c.drawLine(Offset(0, -u * 1.1), Offset(-u * 0.30 - swing * u * 0.25, 0), dark);

  // backpack
  c.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(-u * 0.55, -u * 1.95), width: u * 0.55, height: u * 1.05),
      Radius.circular(u * 0.18),
    ),
    Paint()..color = AppColors.forest,
  );
  // body
  c.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(0, -u * 1.9), width: u * 0.95, height: u * 1.35),
      Radius.circular(u * 0.3),
    ),
    Paint()..color = AppColors.terracotta,
  );
  // head + helmet
  c.drawCircle(Offset(u * 0.05, -u * 2.85), u * 0.38, Paint()..color = const Color(0xFFF2C9A0));
  c.drawArc(
    Rect.fromCircle(center: Offset(u * 0.05, -u * 2.88), radius: u * 0.42),
    math.pi,
    math.pi,
    true,
    Paint()..color = const Color(0xFFF7F8F7),
  );

  // arm + ice axe
  final handY = -u * 3.0 + (moving ? _wave(t, 10, 0.25) * u * 0.18 : 0);
  final hand = Offset(u * 0.85, handY);
  c.drawLine(
    Offset(u * 0.2, -u * 2.3),
    hand,
    Paint()
      ..color = AppColors.terracotta
      ..strokeWidth = u * 0.26
      ..strokeCap = StrokeCap.round,
  );
  final axe = Paint()
    ..color = const Color(0xFFDDE5E3)
    ..strokeWidth = u * 0.12
    ..strokeCap = StrokeCap.round;
  c.drawLine(hand.translate(-u * 0.1, u * 0.5), hand.translate(u * 0.12, -u * 0.75), axe);
  c.drawLine(hand.translate(u * 0.12, -u * 0.75), hand.translate(u * 0.45, -u * 0.62), axe);

  c.restore();
}
