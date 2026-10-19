import 'package:flutter/material.dart';

// ════════════════════════════════════════════════════════════════════════════
//  ONBOARDING CONFIGURATION — copy and scene order live here.
//  The scenes themselves are drawn in code (see `scenes/`), so no image assets
//  are needed.
// ════════════════════════════════════════════════════════════════════════════

/// Which illustrated scene to show.
enum OnboardingSceneKind { balloons, summit, sailing }

/// Brand accent used by the onboarding call-to-action.
abstract final class OnboardingPalette {
  static const coral = Color(0xFFFF6B3D);
  static const coralDeep = Color(0xFFF04E23);
}

class OnboardingScene {
  const OnboardingScene({
    required this.kind,
    required this.title,
    required this.description,
  });

  final OnboardingSceneKind kind;
  final String title;
  final String description;
}

/// Exactly three scenes, in the order they are shown.
const onboardingScenes = <OnboardingScene>[
  OnboardingScene(
    kind: OnboardingSceneKind.balloons,
    title: 'Your Next Adventure Awaits',
    description:
        'Discover incredible destinations and turn your travel dreams into unforgettable memories.',
  ),
  OnboardingScene(
    kind: OnboardingSceneKind.sailing,
    title: 'Find Your Kind of Paradise',
    description:
        'From crystal-clear oceans to peaceful beaches, your next escape is closer than you think.',
  ),
  OnboardingScene(
    kind: OnboardingSceneKind.summit,
    title: 'Every Journey Tells a Story',
    description:
    'Explore breathtaking landscapes, hidden gems, and remarkable places waiting to be discovered.',
  ),
];
