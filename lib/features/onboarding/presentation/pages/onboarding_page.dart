import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../core/theme/app_colors.dart';
import '../config/onboarding_scenes.dart';
import '../widgets/onboarding_controls.dart';
import '../widgets/onboarding_scene_art.dart';
import '../widgets/zoom_scene_transition.dart';

/// Three-scene onboarding with a cinematic zoom transition:
/// Next zooms *into* the current scene and reveals the next one, Back zooms
/// *out* and returns to the previous one.
///
/// Scene art & copy live in `config/onboarding_scenes.dart`, the transition in
/// `widgets/zoom_scene_transition.dart`; this page only coordinates them.
class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key, required this.onFinished});

  /// Integration point: called by "Get Started" and "Skip".
  final VoidCallback onFinished;

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage>
    with TickerProviderStateMixin {
  static const _duration = Duration(milliseconds: 850);
  static const _reducedMotionDuration = Duration(milliseconds: 300);
  static const _swipeVelocity = 250.0;

  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: _duration,
  );

  /// Looping 0 → 1 clock for the idle motion inside the scenes.
  late final AnimationController _ambient = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 14),
  );
  late final Animation<double> _progress = CurvedAnimation(
    parent: _controller,
    curve: Curves.easeInOutCubic,
  );

  int _from = 0;
  int _to = 0;
  bool _reduceMotion = false;

  bool get _busy => _controller.isAnimating;
  bool get _isFirst => _to == 0;
  bool get _isLast => _to == onboardingScenes.length - 1;

  @override
  void initState() {
    super.initState();
    assert(onboardingScenes.length == 3, 'Onboarding expects exactly 3 scenes');
    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed && mounted) {
        setState(() => _from = _to); // back to the idle (single layer) state
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _reduceMotion = MediaQuery.disableAnimationsOf(context);

    // Idle scene motion respects the system "reduce motion" setting.
    if (_reduceMotion) {
      _ambient.stop();
    } else if (!_ambient.isAnimating) {
      _ambient.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _ambient.dispose();
    super.dispose();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  void _go(int target) {
    // Ignore requests while a transition is running (no overlapping moves).
    if (_busy || target == _to) return;
    if (target < 0 || target >= onboardingScenes.length) return;

    HapticFeedback.selectionClick();
    _controller.duration = _reduceMotion ? _reducedMotionDuration : _duration;
    setState(() {
      _from = _to;
      _to = target;
    });
    _controller.forward(from: 0);
  }

  void _next() {
    if (_busy) return;
    if (_isLast) {
      widget.onFinished();
    } else {
      _go(_to + 1);
    }
  }

  void _back() => _go(_to - 1);

  void _onDragEnd(DragEndDetails details) {
    final v = details.primaryVelocity ?? 0;
    if (v < -_swipeVelocity) {
      _next();
    } else if (v > _swipeVelocity) {
      _back();
    }
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return PopScope(
      // System back steps through the scenes instead of leaving the app.
      canPop: _isFirst && !_busy,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _back();
      },
      child: Scaffold(
        backgroundColor: AppColors.forestDeep,
        body: Stack(
          fit: StackFit.expand,
          children: [
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onHorizontalDragEnd: _onDragEnd,
              child: ZoomSceneTransition(
                animation: _progress,
                fromIndex: _from,
                toIndex: _to,
                reduceMotion: _reduceMotion,
                sceneBuilder: (context, index) => OnboardingSceneArt(
                  kind: onboardingScenes[index].kind,
                  ambient: _ambient,
                ),
              ),
            ),
            const IgnorePointer(child: OnboardingReadabilityScrim()),
            SafeArea(
              minimum: const EdgeInsets.fromLTRB(24, 12, 24, 20),
              child: Column(
                children: [
                  _buildTopBar(),
                  const Spacer(),
                  Align(
                    alignment: Alignment.bottomLeft,
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 560),
                      child: _buildCopy(),
                    ),
                  ),
                  const SizedBox(height: 28),
                  _buildBottomBar(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Row(
      children: [
        const OnboardingBrand(),
        const Spacer(),
        AnimatedOpacity(
          duration: const Duration(milliseconds: 300),
          opacity: _isLast ? 0 : 1,
          child: IgnorePointer(
            ignoring: _isLast,
            child: OnboardingSkipButton(
              key: const Key('onboarding_skip'),
              onPressed: widget.onFinished,
            ),
          ),
        ),
      ],
    );
  }

  /// Headline/description: the outgoing copy drifts away in the direction of
  /// travel while the incoming copy settles in, following the same progress as
  /// the background.
  Widget _buildCopy() {
    return AnimatedBuilder(
      animation: _progress,
      builder: (context, _) {
        if (_from == _to) {
          return OnboardingCopy(
            key: ValueKey<int>(_to),
            scene: onboardingScenes[_to],
          );
        }

        final t = _progress.value;
        final dir = _to > _from ? 1.0 : -1.0;
        final out = const Interval(0.0, 0.4, curve: Curves.easeIn).transform(t);
        final inn = const Interval(0.45, 1.0, curve: Curves.easeOut)
            .transform(t);
        final shift = _reduceMotion ? 0.0 : 24.0;

        return Stack(
          alignment: Alignment.bottomLeft,
          children: [
            Opacity(
              opacity: 1 - out,
              child: Transform.translate(
                offset: Offset(0, -dir * shift * out),
                child: OnboardingCopy(
                  key: ValueKey<int>(_from),
                  scene: onboardingScenes[_from],
                ),
              ),
            ),
            Opacity(
              opacity: inn,
              child: Transform.translate(
                offset: Offset(0, dir * shift * (1 - inn)),
                child: OnboardingCopy(
                  key: ValueKey<int>(_to),
                  scene: onboardingScenes[_to],
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildBottomBar() {
    return Row(
      children: [
        AnimatedBuilder(
          animation: _progress,
          builder: (context, _) {
            final position = _from + (_to - _from) * _progress.value;
            return OnboardingPageIndicator(
              position: position,
              count: onboardingScenes.length,
            );
          },
        ),
        const Spacer(),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          switchInCurve: Curves.easeOutCubic,
          switchOutCurve: Curves.easeInCubic,
          transitionBuilder: (child, animation) => SizeTransition(
            axis: Axis.horizontal,
            axisAlignment: 1,
            sizeFactor: animation,
            child: FadeTransition(opacity: animation, child: child),
          ),
          child: _isFirst
              ? const SizedBox.shrink(key: ValueKey('no-back'))
              : Padding(
                  key: const ValueKey('back'),
                  padding: const EdgeInsets.only(right: 12),
                  child: OnboardingGlassButton(
                    key: const Key('onboarding_back'),
                    icon: Icons.arrow_back_rounded,
                    tooltip: 'Back',
                    onPressed: _back,
                  ),
                ),
        ),
        OnboardingPrimaryButton(
          key: const Key('onboarding_next'),
          label: _isLast ? 'Get Started' : 'Next',
          onPressed: _next,
        ),
      ],
    );
  }
}
