import 'package:flutter/material.dart';

import '../config/onboarding_scenes.dart';
import '../scenes/balloon_scene_painter.dart';
import '../scenes/sailing_scene_painter.dart';
import '../scenes/summit_scene_painter.dart';

/// Full-bleed, continuously animated illustration of one scene.
///
/// [ambient] is a looping 0 → 1 animation owned by the page; the painters
/// listen to it directly, so animating never rebuilds any widget.
class OnboardingSceneArt extends StatelessWidget {
  const OnboardingSceneArt({
    super.key,
    required this.kind,
    required this.ambient,
  });

  final OnboardingSceneKind kind;
  final Animation<double> ambient;

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      child: CustomPaint(
        painter: switch (kind) {
          OnboardingSceneKind.balloons => BalloonScenePainter(ambient),
          OnboardingSceneKind.sailing => SailingScenePainter(ambient),
          OnboardingSceneKind.summit => SummitScenePainter(ambient),
        },
      ),
    );
  }
}
