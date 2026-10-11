import 'package:flutter/material.dart';

import '../config/onboarding_scenes.dart';

/// Headline + description overlaid on the scene.
class OnboardingCopy extends StatelessWidget {
  const OnboardingCopy({super.key, required this.scene});

  final OnboardingScene scene;

  static const _shadow = [
    Shadow(color: Color(0x66000000), blurRadius: 14, offset: Offset(0, 2)),
  ];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final titleSize = (width * 0.088).clamp(28.0, 40.0);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          scene.title,
          style: TextStyle(
            color: Colors.white,
            fontSize: titleSize,
            height: 1.12,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.6,
            shadows: _shadow,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          scene.description,
          style: const TextStyle(
            color: Color(0xE6FFFFFF),
            fontSize: 16,
            height: 1.5,
            shadows: _shadow,
          ),
        ),
      ],
    );
  }
}

/// Pill indicators. [position] is fractional (e.g. 0.4 while moving from
/// scene 0 to scene 1) so the active pill morphs continuously with the
/// transition.
class OnboardingPageIndicator extends StatelessWidget {
  const OnboardingPageIndicator({
    super.key,
    required this.position,
    required this.count,
  });

  final double position;
  final int count;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Step ${position.round() + 1} of $count',
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < count; i++)
            Container(
              width: 8 + 26 * (1 - (position - i).abs()).clamp(0.0, 1.0),
              height: 8,
              margin: const EdgeInsets.only(right: 6),
              decoration: BoxDecoration(
                color: Color.lerp(
                  const Color(0x73FFFFFF),
                  Colors.white,
                  (1 - (position - i).abs()).clamp(0.0, 1.0),
                ),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
        ],
      ),
    );
  }
}

/// Translucent circular icon button (Back).
class OnboardingGlassButton extends StatelessWidget {
  const OnboardingGlassButton({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onPressed,
  });

  final IconData icon;
  final String tooltip;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: Material(
        color: const Color(0x29FFFFFF),
        shape: const CircleBorder(side: BorderSide(color: Color(0x59FFFFFF))),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onPressed,
          child: SizedBox(
            width: 56,
            height: 56,
            child: Icon(icon, color: Colors.white, size: 24),
          ),
        ),
      ),
    );
  }
}

/// Minimal translucent "Skip" pill.
class OnboardingSkipButton extends StatelessWidget {
  const OnboardingSkipButton({super.key, required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0x29FFFFFF),
      shape: const StadiumBorder(side: BorderSide(color: Color(0x40FFFFFF))),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onPressed,
        child: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 18, vertical: 10),
          child: Text(
            'Skip',
            style: TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }
}

/// Coral-orange call to action. Its width animates when the label changes
/// between "Next" and "Get Started".
class OnboardingPrimaryButton extends StatelessWidget {
  const OnboardingPrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
  });

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [OnboardingPalette.coral, OnboardingPalette.coralDeep],
        ),
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: OnboardingPalette.coral.withValues(alpha: 0.45),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          borderRadius: BorderRadius.circular(30),
          onTap: onPressed,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 26),
            child: SizedBox(
              height: 56,
              child: AnimatedSize(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOutCubic,
                alignment: Alignment.centerLeft,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 250),
                      child: Text(
                        label,
                        key: ValueKey<String>(label),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.2,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Icon(
                      Icons.arrow_forward_rounded,
                      color: Colors.white,
                      size: 22,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Soft brand-tinted scrims that keep the overlaid text and controls readable
/// on any image, without a hard panel.
class OnboardingReadabilityScrim extends StatelessWidget {
  const OnboardingReadabilityScrim({super.key});

  @override
  Widget build(BuildContext context) {
    return const DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0x730A2C27),
            Color(0x000A2C27),
            Color(0x000A2C27),
            Color(0xB50A2C27),
            Color(0xEB0A2C27),
          ],
          stops: [0.0, 0.18, 0.45, 0.75, 1.0],
        ),
      ),
      child: SizedBox.expand(),
    );
  }
}

/// Small brand mark shown at the top-left.
class OnboardingBrand extends StatelessWidget {
  const OnboardingBrand({super.key});

  @override
  Widget build(BuildContext context) {
    return const Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.explore_rounded, color: Colors.white, size: 26),
        SizedBox(width: 8),
        Text(
          'TravelOra',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.3,
          ),
        ),
      ],
    );
  }
}
