import 'package:flutter/material.dart';

typedef SceneBuilder = Widget Function(BuildContext context, int index);

/// Cinematic "fly-through" transition between sequential scenes.
///
/// It only knows about indices and a progress [animation] (0 → 1 for *every*
/// move, forward or backward) and has no knowledge of what a scene contains.
///
/// Scenes are ordered along a single depth axis. The lower index is always the
/// *front* layer, the higher index the *back* layer:
///
/// * **Forward** (from < to): the front scene is the current one. It zooms
///   *toward* the viewer (1.0 → [frontMaxScale]) and fades out while the next
///   scene, beneath it, settles from slightly smaller (→ 1.0) and fades in.
/// * **Backward** (from > to): the exact time-reverse of the above. The
///   current scene is the back layer and *recedes* (1.0 → [backMinScale]) while
///   the previous scene emerges from the viewer's side (frontMaxScale → 1.0).
///
/// Because backward simply plays the forward choreography in reverse, the
/// motion direction is genuinely inverted rather than replayed.
class ZoomSceneTransition extends StatelessWidget {
  const ZoomSceneTransition({
    super.key,
    required this.animation,
    required this.fromIndex,
    required this.toIndex,
    required this.sceneBuilder,
    this.reduceMotion = false,
    this.frontMaxScale = 1.85,
    this.backMinScale = 0.90,
  });

  /// Progress of the current move, 0 → 1 (already eased by the caller).
  final Animation<double> animation;
  final int fromIndex;
  final int toIndex;
  final SceneBuilder sceneBuilder;

  /// When true, scale is disabled and scenes simply cross-fade.
  final bool reduceMotion;
  final double frontMaxScale;
  final double backMinScale;

  static const _frontFade = Interval(0.30, 0.92, curve: Curves.easeInOut);
  static const _backFade = Interval(0.00, 0.45, curve: Curves.easeOut);

  @override
  Widget build(BuildContext context) {
    final idle = fromIndex == toIndex;
    final forward = toIndex > fromIndex;
    final frontIndex = forward ? fromIndex : toIndex;
    final backIndex = forward ? toIndex : fromIndex;

    // Scene widgets are created once per build and reused every frame, so the
    // animation never rebuilds (or re-decodes) the images.
    final front = RepaintBoundary(child: sceneBuilder(context, frontIndex));
    final back = idle
        ? null
        : RepaintBoundary(child: sceneBuilder(context, backIndex));

    return AnimatedBuilder(
      animation: animation,
      builder: (context, _) {
        if (idle) {
          return Stack(
            fit: StackFit.expand,
            children: [_layer(frontIndex, 1, 1, front)],
          );
        }

        // 0 = front scene fully visible, 1 = back scene fully visible.
        final t = animation.value;
        final p = forward ? t : 1 - t;

        final frontOpacity = 1 - _frontFade.transform(p);
        final backOpacity = reduceMotion ? 1.0 : _backFade.transform(p);
        final frontScale =
            reduceMotion ? 1.0 : 1 + (frontMaxScale - 1) * p;
        final backScale = reduceMotion
            ? 1.0
            : backMinScale +
                  (1 - backMinScale) * Curves.easeOutCubic.transform(p);

        return Stack(
          fit: StackFit.expand,
          children: [
            _layer(backIndex, backOpacity, backScale, back!),
            _layer(frontIndex, frontOpacity, frontScale, front),
          ],
        );
      },
    );
  }

  // Keyed by scene index so Flutter keeps each scene's element (and its
  // already-resolved image) alive when moving between idle and transition.
  Widget _layer(int index, double opacity, double scale, Widget child) {
    return Opacity(
      key: ValueKey<int>(index),
      opacity: opacity.clamp(0.0, 1.0),
      child: Transform.scale(scale: scale, child: child),
    );
  }
}
