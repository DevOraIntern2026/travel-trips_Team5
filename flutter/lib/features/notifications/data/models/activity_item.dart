import 'package:flutter/foundation.dart';

abstract final class ActivityType {
  static const String booking = 'booking';
  static const String alert = 'alert';
  static const String prep = 'prep';
  static const String seat = 'seat';
  static const List<String> all = [booking, alert, prep, seat];
}

class ActivityItem {
  final String id;
  final String type;
  final String tag;
  final String title;
  final String body;
  final DateTime createdAt;
  final bool unread;
  final String? imageUrl;
  final String? imageCaption;
  final String? actionLabel;
  final VoidCallback? onAction;

  const ActivityItem({
    required this.id,
    required this.type,
    required this.tag,
    required this.title,
    required this.body,
    required this.createdAt,
    this.unread = false,
    this.imageUrl,
    this.imageCaption,
    this.actionLabel,
    this.onAction,
  });
}
