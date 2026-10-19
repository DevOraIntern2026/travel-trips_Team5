import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import 'scene_kit.dart';

/// Scene 3 — a sailboat on a turquoise sea at sunset.
class SailingScenePainter extends VirtualScenePainter {
  SailingScenePainter(super.ambient);

  static const _horizon = 900.0;

  @override
  void paintScene(Canvas c, Rect view, double t) {
    // Sunset sky
    drawVerticalGradient(
      c,
      Rect.fromLTRB(view.left, view.top, view.right, _horizon + 4),
      const [Color(0xFFFF9558), Color(0xFFFFB57F), Color(0xFFFFE3C8)],
      const [0.0, 0.55, 1.0],
    );

    // Sun
    final sun = const Offset(745, 800);
    drawGlow(c, sun, 380 * (1 + 0.03 * wave(t, 2)), const Color(0x80FFE9A8));
    c.drawCircle(sun, 140, paintOf(const Color(0xFFFFEBA6)));

    // Clouds
    const cloud = Color(0xFFFFEEDD);
    const shade = Color(0xFFFFD2AE);
    drawCloud(c, Offset(70 + wave(t, 1) * 26, 370), 190, color: cloud, shade: shade);
    drawCloud(c, Offset(905 + wave(t, 1, 0.5) * 24, 520), 150, color: cloud, shade: shade);
    drawCloud(c, Offset(40 + wave(t, 1, 0.8) * 20, 780), 130, color: cloud, shade: shade);

    // Birds
    drawBird(c, Offset(330 + wave(t, 2) * 14, 520 + wave(t, 3) * 10), 52, wave(t, 12), const Color(0xCC12211E));
    drawBird(c, Offset(650 + wave(t, 2, 0.3) * 14, 600 + wave(t, 3, 0.4) * 10), 40, wave(t, 12, 0.3), const Color(0xCC12211E));

    // Islands on the horizon
    drawRidge(c, view, baseY: _horizon + 6, amp: 90, freq: 0.006, phase: 1.2, top: const Color(0xFFD9A48A), bottom: const Color(0xFFC48A6D));
    drawRidge(c, view, baseY: _horizon + 6, amp: 55, freq: 0.011, phase: 3.4, top: const Color(0xFFB7826E), bottom: const Color(0xFFA06A58));

    // Sea
    final sea = Rect.fromLTRB(view.left, _horizon, view.right, view.bottom + 40);
    c.drawRect(
      sea,
      Paint()
        ..shader = ui.Gradient.linear(
          sea.topCenter,
          sea.bottomCenter,
          const [Color(0xFF5CC2B5), Color(0xFF2B9A90), Color(0xFF0F6B63)],
          const [0.0, 0.45, 1.0],
        ),
    );

    _sunReflection(c, sun.dx, t);
    _seaTexture(c, t);

    // Boat
    const boatW = 520.0;
    final bx = 465 + wave(t, 1) * 14;
    final waterline = 1085 + wave(t, 3) * 12;
    c.drawOval(
      Rect.fromCenter(center: Offset(bx, waterline + boatW * 0.10), width: boatW * 1.1, height: boatW * 0.08),
      paintOf(const Color(0x330A2C27)),
    );
    c.save();
    c.translate(bx, waterline);
    c.rotate(wave(t, 3, 0.15) * 0.04);
    _sailBoat(c, boatW, t);
    c.restore();

    // Foam + front waves (cover the hull base)
    final foam = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 5
      ..color = const Color(0x99FFFFFF);
    for (var i = 0; i < 3; i++) {
      final y = waterline + boatW * 0.085 + i * 16;
      final w = boatW * (0.55 - i * 0.1);
      final sway = wave(t, 3, i * 0.2) * 10;
      c.drawLine(Offset(bx - w / 2 + sway, y), Offset(bx + w / 2 + sway, y), foam);
    }
    _waveLayer(c, view, baseY: waterline + boatW * 0.09, amp: 10, length: 320, phase: -t * 2, color: const Color(0xFF1F8A80));
    _waveLayer(c, view, baseY: 1370, amp: 14, length: 520, phase: t * 3, color: const Color(0xFF0F6B63));

    _foliage(c, view, t);
  }

  void _sunReflection(Canvas c, double x, double t) {
    for (var i = 0; i < 8; i++) {
      final y = _horizon + 34.0 * (i + 1);
      final width = (260 - i * 24) * (1 + 0.14 * wave(t, 2, i * 0.13));
      c.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromCenter(center: Offset(x + wave(t, 1, i * 0.05) * 8, y), width: width, height: 9),
          const Radius.circular(5),
        ),
        paintOf(Color.fromRGBO(255, 233, 168, 0.55 - i * 0.04)),
      );
    }
  }

  void _seaTexture(Canvas c, double t) {
    final paint = Paint()
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 5;
    final rnd = math.Random(9);
    for (var i = 0; i < 16; i++) {
      final x = rnd.nextDouble() * 1000;
      final y = _horizon + 60 + rnd.nextDouble() * 520;
      final len = 50 + rnd.nextDouble() * 90;
      final a = 0.08 + 0.12 * (0.5 + 0.5 * wave(t, 2, rnd.nextDouble()));
      paint.color = Color.fromRGBO(255, 255, 255, a);
      final dx = wave(t, 1, i * 0.07) * 14;
      c.drawLine(Offset(x + dx, y), Offset(x + dx + len, y), paint);
    }
  }

  void _waveLayer(
    Canvas c,
    Rect view, {
    required double baseY,
    required double amp,
    required double length,
    required double phase,
    required Color color,
  }) {
    final p = Path()..moveTo(view.left - 10, view.bottom + 40);
    for (double x = view.left - 10; x <= view.right + 10; x += 8) {
      p.lineTo(x, baseY + amp * math.sin(x / length * math.pi * 2 + phase * math.pi * 2));
    }
    p
      ..lineTo(view.right + 10, view.bottom + 40)
      ..close();
    c.drawPath(p, paintOf(color));
  }

  void _sailBoat(Canvas c, double w, double t) {
    const mastX = -0.02;
    final billow = 0.03 + wave(t, 3, 0.2) * 0.02;

    // Mast
    c.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTRB(w * (mastX - 0.008), -w * 0.97, w * (mastX + 0.008), -w * 0.08),
        Radius.circular(w * 0.006),
      ),
      paintOf(const Color(0xFF5B4630)),
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
      ..quadraticBezierTo(w * (-0.30 - billow), -w * 0.45, -w * 0.50, -w * 0.15)
      ..lineTo(w * (mastX - 0.02), -w * 0.17)
      ..close();
    c.drawPath(jib, paintOf(AppColors.terracotta));

    // Flag
    final flag = Path()..moveTo(w * mastX, -w * 0.97);
    const steps = 8;
    for (var i = 0; i <= steps; i++) {
      final f = i / steps;
      flag.lineTo(w * mastX + f * w * 0.11, -w * 0.97 + wave(t, 4, f * 0.35) * w * 0.012 * f);
    }
    for (var i = steps; i >= 0; i--) {
      final f = i / steps;
      flag.lineTo(w * mastX + f * w * 0.11 * 0.85, -w * 0.93 + wave(t, 4, f * 0.35) * w * 0.012 * f);
    }
    flag.close();
    c.drawPath(flag, paintOf(AppColors.forest));

    // Hull
    final hull = Path()
      ..moveTo(-w * 0.52, -w * 0.10)
      ..lineTo(w * 0.56, -w * 0.10)
      ..quadraticBezierTo(w * 0.42, w * 0.12, w * 0.20, w * 0.14)
      ..lineTo(-w * 0.32, w * 0.14)
      ..quadraticBezierTo(-w * 0.46, w * 0.10, -w * 0.52, -w * 0.10)
      ..close();
    c.drawPath(hull, paintOf(AppColors.cream));
    c.save();
    c.clipPath(hull);
    c.drawRect(Rect.fromLTRB(-w, -w * 0.10, w, -w * 0.045), paintOf(const Color(0xFFE8531F)));
    c.drawRect(Rect.fromLTRB(-w, w * 0.05, w, w), paintOf(AppColors.forest));
    c.restore();

  }

  /// Dark tropical leaves framing the bottom corners.
  void _foliage(Canvas c, Rect view, double t) {
    const dark = Color(0xFF0A3C38);
    const mid = Color(0xFF0F5750);
    final sway = wave(t, 2) * 0.05;
    final by = view.bottom + 10;

    // bottom-left cluster
    drawLeafFan(c, Offset(view.left + 10, by), count: 9, length: 520, fromAngle: -1.45, toAngle: -0.15, width: 70, color: dark, altColor: mid, sway: sway, seed: 41);
    drawLeafFan(c, Offset(view.left + 80, by + 40), count: 6, length: 340, fromAngle: -1.2, toAngle: -0.3, width: 50, color: mid, altColor: dark, sway: -sway, seed: 42);
    // bottom-right cluster
    drawLeafFan(c, Offset(view.right - 10, by), count: 9, length: 520, fromAngle: -3.0 + 0.0, toAngle: -1.7, width: 70, color: dark, altColor: mid, sway: -sway, seed: 43);
    drawLeafFan(c, Offset(view.right - 90, by + 40), count: 6, length: 340, fromAngle: -2.85, toAngle: -1.95, width: 50, color: mid, altColor: dark, sway: sway, seed: 44);
    drawBushes(c, x0: view.left - 40, x1: view.left + 330, baseY: by, minR: 40, maxR: 70, color: dark, highlight: mid, seed: 45);
    drawBushes(c, x0: view.right - 330, x1: view.right + 40, baseY: by, minR: 40, maxR: 70, color: dark, highlight: mid, seed: 46);
  }
}
