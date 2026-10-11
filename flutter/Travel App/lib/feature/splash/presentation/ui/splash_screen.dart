import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/storage/token_storage.dart';
import '../../../auth/presentation/theme/auth_colors.dart';
import '../../../auth/presentation/widgets/travelora_logo.dart';
import '../../../main/presentation/ui/main_shell.dart';
import '../../../onboarding/presentation/ui/onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _dots = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  )..repeat();

  @override
  void initState() {
    super.initState();
    _goNext();
  }

  Future<void> _goNext() async {
    final hasSession = await Future.wait<bool>([
      getIt<TokenStorage>().hasSession(),
      Future<void>.delayed(
        const Duration(milliseconds: 2500),
      ).then((_) => true),
    ]).then((results) => results.first);
    if (!mounted) return;

    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) =>
            hasSession ? const MainShell() : const OnboardingScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _dots.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          const Positioned.fill(child: _SplashBackground()),
          const Center(child: TravelOraLogo(markSize: 86)),
          Positioned(
            left: 0,
            right: 0,
            bottom: 48,
            child: AnimatedBuilder(
              animation: _dots,
              builder: (context, _) {
                const colors = [
                  AuthColors.primary,
                  AuthColors.brandOrange,
                  AuthColors.primary,
                ];
                return Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(3, (i) {
                    final phase = (_dots.value - i * 0.18) % 1.0;
                    final scale = 0.8 + 0.5 * math.sin(phase * math.pi);
                    return Container(
                      width: 8,
                      height: 8,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      transform: Matrix4.diagonal3Values(scale, scale, 1),
                      transformAlignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: colors[i],
                        shape: BoxShape.circle,
                      ),
                    );
                  }),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _SplashBackground extends StatelessWidget {
  const _SplashBackground();

  @override
  Widget build(BuildContext context) {
    return CustomPaint(painter: _BackgroundPainter());
  }
}

class _BackgroundPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final soft = Paint()..color = const Color(0xFFD3DEDF).withAlpha(150);
    final softer = Paint()..color = const Color(0xFFE3EBEC).withAlpha(170);
    canvas.drawCircle(Offset(w * 0.98, h * 0.0), w * 0.5, softer);
    canvas.drawCircle(Offset(w * 1.0, -h * 0.02), w * 0.42, soft);

    final dark = Offset(w * 0.98, -h * 0.02);
    canvas.drawCircle(dark, w * 0.3, Paint()..color = AuthColors.primary);

    final ring = Paint()
      ..color = Colors.white.withAlpha(60)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    final center = Offset(w * 0.9, h * 0.05);
    canvas.drawCircle(center, w * 0.095, ring);
    canvas.drawCircle(center, w * 0.05, ring);
    canvas.drawCircle(
      center,
      w * 0.012,
      Paint()..color = AuthColors.brandOrange,
    );
    canvas.drawCircle(Offset(-w * 0.05, h * 0.99), w * 0.45, softer);
    canvas.drawCircle(
      Offset(-w * 0.02, h * 1.02),
      w * 0.3,
      Paint()..color = const Color(0xFFB8CCCC).withAlpha(170),
    );
    canvas.drawCircle(
      Offset(w * 0.01, h * 0.94),
      w * 0.012,
      Paint()..color = const Color(0xFFE0907D),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
