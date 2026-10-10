import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../core/theme/app_colors.dart';
import '../widgets/onboarding_stage.dart';

class _Slide {
  const _Slide({
    required this.eyebrow,
    required this.title,
    required this.body,
  });

  final String eyebrow;
  final String title;
  final String body;
}

const _slides = [
  _Slide(
    eyebrow: 'DISCOVER',
    title: 'Find your next\nescape',
    body:
        'Browse curated trips from trusted operators and discover departures that fit your style.',
  ),
  _Slide(
    eyebrow: 'PLAN',
    title: 'Pick the dates\nthat suit you',
    body:
        'Compare departure dates, live seat availability and prices before you commit.',
  ),
  _Slide(
    eyebrow: 'GO',
    title: 'Reach your\nsummit',
    body:
        'Book in a few taps and get alerts the moment seats or departures change.',
  ),
];

/// Animated onboarding: big illustrated scenes (balloon → sailing boat →
/// mountain climb) that react to the swipe position with parallax, a morphing
/// sky gradient and an ambient idle animation.
class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key, required this.onFinished});

  /// Called when the user taps "Get started" or "Skip".
  final VoidCallback onFinished;

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage>
    with SingleTickerProviderStateMixin {
  late final PageController _controller = PageController();
  late final AnimationController _ambient = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 12),
  );
  final ValueNotifier<double> _page = ValueNotifier<double>(0);

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      if (_controller.hasClients) {
        _page.value = _controller.page ?? 0;
      }
    });
    _ambient.repeat();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Respect the system "reduce motion" setting.
    if (MediaQuery.disableAnimationsOf(context)) {
      _ambient.stop();
    } else if (!_ambient.isAnimating) {
      _ambient.repeat();
    }
  }

  @override
  void dispose() {
    _ambient.dispose();
    _controller.dispose();
    _page.dispose();
    super.dispose();
  }

  void _next() {
    final current = (_controller.page ?? 0).round();
    if (current >= _slides.length - 1) {
      widget.onFinished();
      return;
    }
    _controller.nextPage(
      duration: const Duration(milliseconds: 700),
      curve: Curves.easeInOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    final height = media.size.height;
    final width = media.size.width;
    final sheetTop = height * 0.56;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Big animated illustration
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: height * 0.64,
            child: OnboardingStage(page: _page, ambient: _ambient),
          ),

          // White bottom sheet
          Positioned(
            top: sheetTop,
            left: 0,
            right: 0,
            bottom: 0,
            child: const DecoratedBox(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(36)),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x1A0A2C27),
                    blurRadius: 30,
                    offset: Offset(0, -8),
                  ),
                ],
              ),
            ),
          ),

          // Swipeable text (full screen so the whole page is swipeable)
          Positioned.fill(
            child: PageView.builder(
              controller: _controller,
              itemCount: _slides.length,
              physics: const BouncingScrollPhysics(),
              onPageChanged: (_) => HapticFeedback.selectionClick(),
              itemBuilder: (context, index) => _SlideText(
                index: index,
                page: _page,
                slide: _slides[index],
                topInset: sheetTop + 32,
                width: width,
              ),
            ),
          ),

          // Top bar: brand + skip
          Positioned(
            top: media.padding.top + 12,
            left: 24,
            right: 16,
            child: AnimatedBuilder(
              animation: _page,
              builder: (context, _) {
                final dark = (_page.value - 1).clamp(0.0, 1.0);
                final color = Color.lerp(AppColors.ink, Colors.white, dark)!;
                final skipOpacity = (1 - (_page.value - 1)).clamp(0.0, 1.0);
                return Row(
                  children: [
                    Icon(Icons.explore_rounded, color: color, size: 26),
                    const SizedBox(width: 8),
                    Text(
                      'TravelOra',
                      style: TextStyle(
                        color: color,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.3,
                      ),
                    ),
                    const Spacer(),
                    Opacity(
                      opacity: skipOpacity,
                      child: IgnorePointer(
                        ignoring: skipOpacity < 0.5,
                        child: TextButton(
                          onPressed: widget.onFinished,
                          style: TextButton.styleFrom(
                            foregroundColor: color,
                            backgroundColor: color.withValues(alpha: 0.10),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 10,
                            ),
                            shape: const StadiumBorder(),
                          ),
                          child: const Text(
                            'Skip',
                            style: TextStyle(fontWeight: FontWeight.w700),
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),

          // Bottom controls: indicator + morphing CTA
          Positioned(
            left: 24,
            right: 24,
            bottom: media.padding.bottom + 20,
            child: Row(
              children: [
                _PageIndicator(page: _page, count: _slides.length),
                const Spacer(),
                _NextButton(page: _page, onPressed: _next),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Text block of one slide. Each part moves at a slightly different speed
/// while swiping, which gives a soft staggered parallax.
class _SlideText extends StatelessWidget {
  const _SlideText({
    required this.index,
    required this.page,
    required this.slide,
    required this.topInset,
    required this.width,
  });

  final int index;
  final ValueNotifier<double> page;
  final _Slide slide;
  final double topInset;
  final double width;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: page,
      builder: (context, _) {
        final o = page.value - index;
        final opacity = (1 - o.abs() * 1.6).clamp(0.0, 1.0);

        Widget part(double factor, Widget child) => Transform.translate(
          offset: Offset(o * width * factor, 0),
          child: child,
        );

        return Opacity(
          opacity: opacity,
          child: Padding(
            padding: EdgeInsets.fromLTRB(24, topInset, 24, 0),
            child: Align(
              alignment: Alignment.topLeft,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  part(
                    0.25,
                    Text(
                      slide.eyebrow,
                      style: const TextStyle(
                        color: AppColors.terracotta,
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 2.2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  part(
                    0.35,
                    Text(
                      slide.title,
                      style: const TextStyle(
                        color: AppColors.ink,
                        fontSize: 30,
                        height: 1.15,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  part(
                    0.5,
                    Text(
                      slide.body,
                      style: const TextStyle(
                        color: AppColors.muted,
                        fontSize: 15,
                        height: 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _PageIndicator extends StatelessWidget {
  const _PageIndicator({required this.page, required this.count});

  final ValueListenable<double> page;
  final int count;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: page,
      builder: (context, _) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < count; i++)
              Builder(
                builder: (context) {
                  final d = (1 - (page.value - i).abs()).clamp(0.0, 1.0);
                  return Container(
                    width: 8 + 24 * d,
                    height: 8,
                    margin: const EdgeInsets.only(right: 6),
                    decoration: BoxDecoration(
                      color: Color.lerp(AppColors.border, AppColors.forest, d),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  );
                },
              ),
          ],
        );
      },
    );
  }
}

/// Round arrow button that smoothly morphs into a "Get started" pill on the
/// last slide.
class _NextButton extends StatelessWidget {
  const _NextButton({required this.page, required this.onPressed});

  final ValueListenable<double> page;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: page,
      builder: (context, _) {
        final last = (page.value - (_slides.length - 2)).clamp(0.0, 1.0);
        final showLabel = last > 0.05;
        return SizedBox(
          height: 58,
          width: 58 + 118 * last,
          child: Material(
            color: AppColors.forest,
            borderRadius: BorderRadius.circular(29),
            elevation: 6,
            shadowColor: AppColors.forest.withValues(alpha: 0.4),
            child: InkWell(
              borderRadius: BorderRadius.circular(29),
              onTap: onPressed,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (showLabel)
                    Flexible(
                      child: Opacity(
                        opacity: last,
                        child: const Text(
                          'Get started',
                          maxLines: 1,
                          softWrap: false,
                          overflow: TextOverflow.clip,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  if (showLabel) SizedBox(width: 8 * last),
                  const Icon(
                    Icons.arrow_forward_rounded,
                    color: Colors.white,
                    size: 24,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
