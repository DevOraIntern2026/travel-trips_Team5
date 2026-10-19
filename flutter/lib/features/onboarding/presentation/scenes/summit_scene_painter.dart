import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import 'scene_kit.dart';

final _stars = List.generate(60, (i) {
  final r = math.Random(i * 7 + 3);
  return (
    x: r.nextDouble() * 1000,
    y: r.nextDouble() * 900 + 20,
    r: 1.6 + r.nextDouble() * 2.6,
    p: r.nextDouble(),
    big: i % 9 == 0,
  );
});

final _flakes = List.generate(30, (i) {
  final r = math.Random(i * 13 + 5);
  return (
    x: r.nextDouble() * 1000,
    y: r.nextDouble() * 1400,
    r: 2 + r.nextDouble() * 3,
    speed: 1 + r.nextInt(3),
    p: r.nextDouble(),
  );
});

/// Scene 2 — night mountain with a dashed route, map pins and a summit flag.
class SummitScenePainter extends VirtualScenePainter {
  SummitScenePainter(super.ambient);

  static const _apex = Offset(615, 330);

  @override
  void paintScene(Canvas c, Rect view, double t) {
    drawVerticalGradient(
      c,
      view,
      const [Color(0xFF082622), Color(0xFF0F3D36), Color(0xFF2A7566)],
      const [0.0, 0.5, 1.0],
    );

    _paintStars(c, t);

    // Moon
    const moon = Offset(200, 330);
    drawGlow(c, moon, 230 * (1 + 0.04 * wave(t, 2)), const Color(0x40FFF6D0));
    c.drawPath(
      Path.combine(
        PathOperation.difference,
        Path()..addOval(Rect.fromCircle(center: moon, radius: 72)),
        Path()..addOval(Rect.fromCircle(center: moon.translate(36, -14), radius: 64)),
      ),
      paintOf(const Color(0xFFFFF1B8)),
    );

    // Night clouds
    const cloud = Color(0xFF1D6155);
    const cloudShade = Color(0xFF174F45);
    drawCloud(c, Offset(40 + wave(t, 1) * 26, 600), 170, color: cloud, shade: cloudShade);
    drawCloud(c, Offset(960 + wave(t, 1, 0.5) * 24, 830), 160, color: cloud, shade: cloudShade);

    // Distant range + side peaks
    drawRidge(c, view, baseY: 960, amp: 90, freq: 0.0075, phase: 0.8, top: const Color(0xFF1A5A4E), bottom: const Color(0xFF14483F));
    _peak(c, apex: const Offset(265, 560), left: -80, right: 520, base: 1250, body: const Color(0xFF2A7F6E), shade: const Color(0xFF206A5B), snow: const Offset(70, 95));
    _peak(c, apex: const Offset(120, 720), left: -100, right: 340, base: 1250, body: const Color(0xFF2D8574), shade: const Color(0xFF247262), snow: const Offset(34, 56));
    _peak(c, apex: const Offset(965, 770), left: 770, right: 1130, base: 1250, body: const Color(0xFF24705F), shade: const Color(0xFF1C5C4F), snow: const Offset(34, 56));

    _mainPeak(c, t);

    // Foothills + mist
    drawRidge(c, view, baseY: 1290, amp: 60, freq: 0.01, phase: 1.4, top: const Color(0xFF1E6A5C), bottom: const Color(0xFF14483F));
    final drift = wave(t, 1) * 40;
    for (final m in [(1250.0, 0.14), (1340.0, 0.18)]) {
      c.drawOval(
        Rect.fromCenter(center: Offset(500 + drift * (m.$1 > 1300 ? -1 : 1), m.$1), width: 1300, height: 120),
        paintOf(Color.fromRGBO(190, 235, 215, m.$2)),
      );
    }

    // Misty lake glow between the forests
    drawGlow(c, const Offset(520, 1430), 320, const Color(0x59A5E0C0));

    _forest(c, view);

    // Snow
    for (final f in _flakes) {
      final y = fract(f.y / 1800 + t * f.speed) * 1800;
      final x = f.x + wave(t, 2, f.p) * 16;
      c.drawCircle(Offset(x, y), f.r, paintOf(const Color(0xB3FFFFFF)));
    }
  }

  void _paintStars(Canvas c, double t) {
    for (var i = 0; i < _stars.length; i++) {
      final s = _stars[i];
      final a = 0.35 + 0.65 * (0.5 + 0.5 * wave(t, 2 + i % 3, s.p));
      final color = Color.fromRGBO(255, 255, 255, a);
      if (s.big) {
        drawSparkle(c, Offset(s.x, s.y), s.r * 4.2, color);
      } else {
        c.drawCircle(Offset(s.x, s.y), s.r, paintOf(color));
      }
    }
  }

  void _peak(
    Canvas c, {
    required Offset apex,
    required double left,
    required double right,
    required double base,
    required Color body,
    required Color shade,
    required Offset snow,
  }) {
    c.drawPath(Path()..addPolygon([Offset(left, base), apex, Offset(right, base)], true), paintOf(body));
    c.drawPath(
      Path()..addPolygon([apex, Offset(right, base), Offset(apex.dx + (right - apex.dx) * 0.2, base)], true),
      paintOf(shade),
    );
    final cap = Path()
      ..moveTo(apex.dx, apex.dy)
      ..lineTo(apex.dx - snow.dx * 0.6, apex.dy + snow.dy)
      ..lineTo(apex.dx - snow.dx * 0.2, apex.dy + snow.dy * 0.78)
      ..lineTo(apex.dx + snow.dx * 0.05, apex.dy + snow.dy * 1.12)
      ..lineTo(apex.dx + snow.dx * 0.3, apex.dy + snow.dy * 0.8)
      ..lineTo(apex.dx + snow.dx * 0.55, apex.dy + snow.dy)
      ..close();
    c.drawPath(cap, paintOf(const Color(0xFFEAF3F0)));
  }

  void _mainPeak(Canvas c, double t) {
    const a = _apex;
    const leftChain = [Offset(540, 440), Offset(500, 430), Offset(430, 620), Offset(380, 600), Offset(250, 900), Offset(100, 1150), Offset(-120, 1320)];
    const rightChain = [Offset(690, 440), Offset(740, 425), Offset(830, 640), Offset(880, 625), Offset(980, 860), Offset(1100, 1100), Offset(1220, 1320)];
    const foot = Offset(590, 1320);

    final leftFace = Path()..addPolygon([a, ...leftChain, foot], true);
    final rightFace = Path()..addPolygon([a, ...rightChain, foot], true);
    c.drawPath(leftFace, paintOf(const Color(0xFF3C9C88)));
    c.drawPath(rightFace, paintOf(const Color(0xFF1B5C4F)));

    // Facets
    void facet(List<Offset> pts, Color color) =>
        c.drawPath(Path()..addPolygon(pts, true), paintOf(color));
    facet(const [a, Offset(540, 440), Offset(470, 700), Offset(600, 760)], const Color(0x14FFFFFF));
    facet(const [Offset(540, 440), Offset(430, 620), Offset(380, 600), Offset(470, 980), Offset(520, 700)], const Color(0x24000000));
    facet(const [Offset(380, 600), Offset(250, 900), Offset(330, 1150), Offset(470, 980)], const Color(0x14FFFFFF));
    facet(const [a, Offset(690, 440), Offset(760, 760), Offset(640, 830)], const Color(0x24000000));
    facet(const [Offset(740, 425), Offset(830, 640), Offset(880, 625), Offset(820, 980), Offset(740, 700)], const Color(0x0FFFFFFF));
    facet(const [Offset(880, 625), Offset(980, 860), Offset(1000, 1200), Offset(820, 980)], const Color(0x22000000));

    // Snow cap (lit on the left, shaded on the right)
    final snow = Path()
      ..moveTo(a.dx, a.dy)
      ..lineTo(540, 440)
      ..lineTo(510, 520)
      ..lineTo(560, 490)
      ..lineTo(585, 560)
      ..lineTo(612, 480)
      ..lineTo(650, 570)
      ..lineTo(672, 490)
      ..lineTo(710, 530)
      ..lineTo(690, 440)
      ..close();
    c.drawPath(snow, paintOf(const Color(0xFFF4F9F7)));
    c.save();
    c.clipPath(rightFace);
    c.drawPath(snow, paintOf(const Color(0xFFC9DDD8)));
    c.restore();

    _route(c, t);
    _summit(c, t);
  }

  void _route(Canvas c, double t) {
    const pts = [
      Offset(520, 1250), Offset(590, 1090), Offset(420, 950), Offset(580, 800),
      Offset(430, 700), Offset(565, 600), Offset(600, 500), Offset(612, 345),
    ];
    final path = Path()..moveTo(pts.first.dx, pts.first.dy);
    for (final p in pts.skip(1)) {
      path.lineTo(p.dx, p.dy);
    }
    const dash = 26.0, gap = 16.0;
    drawDashed(
      c,
      path,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 8
        ..strokeCap = StrokeCap.round
        ..color = AppColors.terracotta,
      dash: dash,
      gap: gap,
      offset: fract(t * 3) * (dash + gap),
    );

    // Pins with a soft pulse
    const pinIdx = [1, 3, 5, 6];
    for (var n = 0; n < pinIdx.length; n++) {
      final pulse = 1 + 0.07 * wave(t, 2, n * 0.18);
      drawPin(c, pts[pinIdx[n]], 20 * pulse, AppColors.terracotta);
    }
  }

  void _summit(Canvas c, double t) {
    // Flag pole + waving flag
    const poleX = 672.0;
    const poleBottom = 335.0;
    const poleTop = 130.0;
    c.drawLine(
      const Offset(poleX, poleBottom),
      const Offset(poleX, poleTop),
      Paint()
        ..color = AppColors.cream
        ..strokeWidth = 5
        ..strokeCap = StrokeCap.round,
    );
    const fw = 120.0, fh = 80.0, steps = 12;
    final flag = Path()..moveTo(poleX, poleTop);
    for (var i = 0; i <= steps; i++) {
      final f = i / steps;
      flag.lineTo(poleX + f * fw, poleTop + wave(t, 3, f * 0.4) * 9 * f);
    }
    for (var i = steps; i >= 0; i--) {
      final f = i / steps;
      flag.lineTo(poleX + f * fw * 0.9, poleTop + fh + wave(t, 3, f * 0.4) * 9 * f);
    }
    flag.close();
    c.drawPath(flag, paintOf(AppColors.terracotta));

    _climber(c, const Offset(615, 336), 24, t);
  }

  void _climber(Canvas c, Offset feet, double u, double t) {
    c.save();
    c.translate(feet.dx, feet.dy);
    final dark = Paint()
      ..color = const Color(0xFF12211E)
      ..strokeWidth = u * 0.30
      ..strokeCap = StrokeCap.round;
    // legs
    c.drawLine(Offset(0, -u * 1.1), Offset(u * 0.38, 0), dark);
    c.drawLine(Offset(0, -u * 1.1), Offset(-u * 0.32, 0), dark);
    // backpack + body
    c.drawRRect(
      RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(-u * 0.55, -u * 1.95), width: u * 0.55, height: u * 1.05), Radius.circular(u * 0.18)),
      paintOf(AppColors.forest),
    );
    c.drawRRect(
      RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(0, -u * 1.9), width: u * 0.95, height: u * 1.35), Radius.circular(u * 0.3)),
      paintOf(AppColors.terracotta),
    );
    // head + helmet
    c.drawCircle(Offset(u * 0.05, -u * 2.85), u * 0.38, paintOf(const Color(0xFFF2C9A0)));
    c.drawArc(
      Rect.fromCircle(center: Offset(u * 0.05, -u * 2.88), radius: u * 0.42),
      math.pi,
      math.pi,
      true,
      paintOf(AppColors.cream),
    );
    // arm holding the flag pole (672 - 615 = 57 px to the right)
    final hand = Offset(57, -u * 2.9 + wave(t, 2) * 3);
    c.drawLine(
      Offset(u * 0.2, -u * 2.4),
      hand,
      Paint()
        ..color = AppColors.terracotta
        ..strokeWidth = u * 0.26
        ..strokeCap = StrokeCap.round,
    );
    c.restore();
  }

  void _forest(Canvas c, Rect view) {
    final baseY = math.max(1590.0, view.bottom - 40);
    c.drawRect(Rect.fromLTRB(view.left - 20, baseY - 30, view.right + 20, view.bottom + 40), paintOf(const Color(0xFF081F1B)));

    // back row
    const back = Color(0xFF0F3D36);
    for (final p in const [(-20.0, 330.0), (70.0, 400.0), (160.0, 320.0), (700.0, 330.0), (790.0, 410.0), (880.0, 340.0), (970.0, 420.0)]) {
      drawPine(c, Offset(p.$1, baseY - 30), p.$2, back);
    }
    // front row
    const front = Color(0xFF0A2C27);
    for (final p in const [(30.0, 470.0), (130.0, 540.0), (230.0, 400.0), (330.0, 330.0), (650.0, 340.0), (750.0, 440.0), (850.0, 540.0), (950.0, 470.0)]) {
      drawPine(c, Offset(p.$1, baseY), p.$2, front);
    }
    // bushes
    drawBushes(c, x0: view.left - 40, x1: 420, baseY: baseY + 20, minR: 50, maxR: 90, color: const Color(0xFF14472E), highlight: const Color(0xFF3F7A3A), seed: 31);
    drawBushes(c, x0: 600, x1: view.right + 40, baseY: baseY + 20, minR: 50, maxR: 90, color: const Color(0xFF14472E), highlight: const Color(0xFF4A8A3C), seed: 32);
  }
}
