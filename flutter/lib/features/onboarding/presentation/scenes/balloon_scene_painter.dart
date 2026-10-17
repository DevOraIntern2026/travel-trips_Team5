import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import 'scene_kit.dart';

/// Scene 1 — hot-air balloons drifting over a lake and a hillside village.
class BalloonScenePainter extends VirtualScenePainter {
  BalloonScenePainter(super.ambient);

  static const _cloudWhite = Color(0xFFFFFFFF);
  static const _cloudShade = Color(0xFFD9E9F2);

  @override
  void paintScene(Canvas c, Rect view, double t) {
    // Sky
    drawVerticalGradient(
      c,
      Rect.fromLTRB(view.left, view.top, view.right, view.bottom),
      const [Color(0xFF62BCEC), Color(0xFFA9DDF3), Color(0xFFE4F5F1)],
      const [0.0, 0.55, 1.0],
    );

    // Sun
    final sun = const Offset(250, 300);
    drawGlow(c, sun, 300 * (1 + 0.03 * wave(t, 2)), const Color(0x59FFF6D0));
    c.drawCircle(sun, 82, paintOf(const Color(0xFFFFF1B8)));

    // Back clouds (gentle floating)
    drawCloud(c, Offset(40 + wave(t, 1) * 28, 250), 200, color: _cloudWhite, shade: _cloudShade);
    drawCloud(c, Offset(850 + wave(t, 1, 0.4) * 24, 450), 150, color: _cloudWhite, shade: _cloudShade);
    drawCloud(c, Offset(70 + wave(t, 1, 0.7) * 22, 760), 120, color: _cloudWhite, shade: _cloudShade);

    // Layered hills
    drawRidge(c, view, baseY: 1040, amp: 90, freq: 0.0065, phase: 0.6, top: const Color(0xFFB4DAD0), bottom: const Color(0xFF9ECFC2));
    drawRidge(c, view, baseY: 1120, amp: 75, freq: 0.0095, phase: 2.0, top: const Color(0xFF86C4B2), bottom: const Color(0xFF6DB39F));

    // Lake
    final lake = Rect.fromLTRB(view.left, 1170, view.right, view.bottom + 40);
    c.drawRect(
      lake,
      Paint()
        ..shader = ui.Gradient.linear(
          lake.topCenter,
          lake.bottomCenter,
          const [Color(0xFF7CC4E8), Color(0xFF3A8CC4), Color(0xFF1F5E96)],
          const [0.0, 0.55, 1.0],
        ),
    );
    _lakeShimmer(c, t);

    _leftShore(c, view);
    _village(c, view);

    // Cloud drifting in front of the village
    drawCloud(c, Offset(770 + wave(t, 1, 0.2) * 34, 1000), 240, color: _cloudWhite, shade: _cloudShade);

    // Small balloons (parallax depth)
    drawBalloon(
      c,
      Offset(175, 720 + wave(t, 3, 0.3) * 14),
      72,
      colors: const [AppColors.forestMid, AppColors.cream, Color(0xFF7DBDAD)],
      rotation: wave(t, 2, 0.2) * 0.05,
      flicker: wave(t, 24, 0.1),
    );
    drawBalloon(
      c,
      Offset(875, 380 + wave(t, 2, 0.7) * 14),
      62,
      colors: const [Color(0xFFF59E0B), AppColors.cream, AppColors.terracotta],
      rotation: wave(t, 2, 0.6) * 0.05,
      flicker: wave(t, 24, 0.5),
    );

    // Hero balloon
    drawBalloon(
      c,
      Offset(500, 450 + wave(t, 2) * 22),
      228,
      colors: const [AppColors.terracotta, AppColors.cream, AppColors.forest],
      rotation: wave(t, 1, 0.15) * 0.045,
      flicker: wave(t, 24),
      passengers: false,
    );

    // Foreground foliage framing the bottom corners
    final fy = view.bottom - 40;
    drawBushes(c, x0: view.left - 60, x1: 430, baseY: fy, minR: 70, maxR: 120, color: const Color(0xFF15472F), highlight: const Color(0xFF23703F), seed: 21);
    drawBushes(c, x0: 640, x1: view.right + 60, baseY: fy, minR: 70, maxR: 120, color: const Color(0xFF15472F), highlight: const Color(0xFF23703F), seed: 22);
  }

  void _lakeShimmer(Canvas c, double t) {
    final paint = Paint()..strokeCap = StrokeCap.round..strokeWidth = 5;
    for (var i = 0; i < 9; i++) {
      final x = 560 + (i * 83) % 420 + wave(t, 2, i * 0.11) * 18;
      final y = 1230 + i * 26.0;
      final len = 40 + (i % 3) * 22.0;
      final a = 0.18 + 0.22 * (0.5 + 0.5 * wave(t, 2, i * 0.17));
      paint.color = Color.fromRGBO(255, 255, 255, a);
      c.drawLine(Offset(x, y), Offset(x + len, y), paint);
    }
  }

  void _leftShore(Canvas c, Rect view) {
    final path = Path()
      ..moveTo(view.left - 60, 1010)
      ..cubicTo(150, 1020, 330, 1130, 520, 1340)
      ..quadraticBezierTo(565, 1390, 470, 1430)
      ..lineTo(view.left - 60, 1520)
      ..close();
    c.drawPath(
      path,
      Paint()
        ..shader = ui.Gradient.linear(
          const Offset(0, 1000),
          const Offset(0, 1520),
          const [Color(0xFF3C8F55), Color(0xFF1F6B3F)],
        ),
    );
    c.save();
    c.clipPath(path);
    drawBushes(c, x0: view.left - 40, x1: 560, baseY: 1180, minR: 34, maxR: 54, color: const Color(0xFF2E7D49), highlight: const Color(0xFF55A863), seed: 3);
    drawBushes(c, x0: view.left - 40, x1: 520, baseY: 1300, minR: 40, maxR: 62, color: const Color(0xFF1F6B3F), highlight: const Color(0xFF3E9457), seed: 4);
    drawBushes(c, x0: view.left - 40, x1: 480, baseY: 1440, minR: 46, maxR: 70, color: const Color(0xFF17573A), highlight: const Color(0xFF2E7D49), seed: 5);
    c.restore();
    // shoreline highlight
    c.drawPath(
      Path()
        ..moveTo(150, 1020)
        ..cubicTo(330, 1130, 420, 1250, 520, 1340),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 4
        ..color = const Color(0x66FFFFFF),
    );
  }

  void _village(Canvas c, Rect view) {
    final hill = Path()
      ..moveTo(view.right + 60, 940)
      ..cubicTo(900, 970, 760, 1090, 620, 1290)
      ..quadraticBezierTo(580, 1350, 700, 1390)
      ..lineTo(view.right + 60, 1460)
      ..close();
    c.drawPath(
      hill,
      Paint()
        ..shader = ui.Gradient.linear(
          const Offset(0, 940),
          const Offset(0, 1460),
          const [Color(0xFF4A9E5C), Color(0xFF28733F)],
        ),
    );

    c.save();
    c.clipPath(hill);
    drawBushes(c, x0: 600, x1: view.right + 40, baseY: 1130, minR: 22, maxR: 36, color: const Color(0xFF3A8B4F), highlight: const Color(0xFF63B06C), seed: 7);

    const wall = Color(0xFFF2E3C4);
    const wallAlt = Color(0xFFE8D2A8);
    const roof = Color(0xFFC8501E);
    const houses = <(double, double, double, double)>[
      (830, 1135, 70, 52), (905, 1118, 62, 46), (968, 1100, 66, 50),
      (765, 1190, 64, 48), (850, 1182, 74, 54), (935, 1162, 66, 48),
      (995, 1140, 58, 44), (705, 1250, 62, 46), (800, 1240, 70, 50),
    ];
    for (var i = 0; i < houses.length; i++) {
      final h = houses[i];
      drawHouse(c, Offset(h.$1, h.$2), h.$3, h.$4, i.isEven ? wall : wallAlt, roof);
    }
    drawBushes(c, x0: 600, x1: view.right + 40, baseY: 1300, minR: 30, maxR: 48, color: const Color(0xFF2B7A45), highlight: const Color(0xFF4F9E5E), seed: 8);
    c.restore();

    // Cypresses are drawn outside the clip so their tips rise above the hill.
    for (final cy in const [(775, 1138, 120.0), (880, 1096, 130.0), (945, 1074, 120.0), (730, 1215, 110.0)]) {
      drawCypress(c, Offset(cy.$1.toDouble(), cy.$2.toDouble()), cy.$3, const Color(0xFF1B5A36));
    }

    c.drawPath(
      Path()
        ..moveTo(1020, 950)
        ..cubicTo(900, 975, 770, 1090, 625, 1290),
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 4
        ..color = const Color(0x55FFFFFF),
    );
  }
}
