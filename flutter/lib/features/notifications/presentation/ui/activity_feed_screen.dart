import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/di/service_locator.dart';
import '../../../../core/router/app_router.dart' show TripResultsRouteData;

import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/text_format.dart';
import '../../../../core/widgets/app_widgets.dart';
import '../../../booking/presentation/utils/booking_display.dart';
import '../../data/models/activity_item.dart';

class _CategoryStyle {
  const _CategoryStyle(this.label, this.icon, this.iconBackground);

  final String label;
  final IconData icon;
  final Color iconBackground;
}

class ActivityFeedScreen extends StatefulWidget {
  const ActivityFeedScreen({super.key, this.items = const []});

  final List<ActivityItem> items;

  @override
  State<ActivityFeedScreen> createState() => _ActivityFeedScreenState();
}

class _ActivityFeedScreenState extends State<ActivityFeedScreen> {
  String? _filter;
  final Set<String> _read = {};
  List<ActivityItem> _items = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    if (widget.items.isNotEmpty) {
      _items = List<ActivityItem>.from(widget.items);
      _loading = false;
    } else {
      _loadMockNotifications();
    }
  }

  Future<void> _loadMockNotifications() async {
    try {
      final response = await getIt<Dio>().get('notifications');
      final body = response.data is Map
          ? Map<String, dynamic>.from(response.data as Map)
          : <String, dynamic>{};
      final records = body['data'] is List ? body['data'] as List : const [];
      final loaded = records.whereType<Map>().map((raw) {
        final data = Map<String, dynamic>.from(raw);
        final bookingId = (data['bookingId'] as num?)?.toInt();
        final destinationId = (data['destinationId'] as num?)?.toInt();
        return ActivityItem(
          id: data['id'].toString(),
          type: data['type'] as String? ?? ActivityType.alert,
          tag: data['tag'] as String? ?? 'UPDATE',
          title: data['title'] as String? ?? 'Travel update',
          body: data['body'] as String? ?? '',
          createdAt:
              DateTime.tryParse(data['createdAt']?.toString() ?? '') ??
              DateTime.now(),
          unread: data['unread'] as bool? ?? false,
          imageUrl: data['imageUrl'] as String?,
          imageCaption: data['imageCaption'] as String?,
          actionLabel: data['actionLabel'] as String?,
          onAction: bookingId != null
              ? () => context.push('/bookings/$bookingId')
              : destinationId != null
              ? () => context.push(
                  '/trips/results',
                  extra: TripResultsRouteData(
                    title: 'Recommended trips',
                    destinationId: destinationId,
                  ),
                )
              : null,
        );
      }).toList();
      if (mounted) {
        setState(() {
          _items = loaded;
          _loading = false;
        });
      }
    } on Object {
      if (mounted) {
        setState(() {
          _items = List<ActivityItem>.from(widget.items);
          _loading = false;
        });
      }
    }
  }

  static const Map<String, _CategoryStyle> _styles = {
    ActivityType.booking: _CategoryStyle(
      'Bookings',
      Icons.home_outlined,
      AppColors.mint,
    ),
    ActivityType.alert: _CategoryStyle(
      'Permits & Weather',
      Icons.ac_unit,
      AppColors.infoSurface,
    ),
    ActivityType.prep: _CategoryStyle(
      'Prep',
      Icons.checklist,
      AppColors.infoSurface,
    ),
    ActivityType.seat: _CategoryStyle(
      'Seat Alerts',
      Icons.event_seat_outlined,
      AppColors.pendingSurface,
    ),
  };

  bool _isUnread(ActivityItem i) => i.unread && !_read.contains(i.id);

  String _group(DateTime d) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final day = DateTime(d.year, d.month, d.day);
    final diff = today.difference(day).inDays;
    if (diff <= 0) return 'TODAY';
    if (diff == 1) return 'YESTERDAY';
    return 'EARLIER';
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final items =
        _items.where((i) => _filter == null || i.type == _filter).toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    final unread = _items.where(_isUnread).length;

    final groups = <String, List<ActivityItem>>{};
    for (final i in items) {
      groups.putIfAbsent(_group(i.createdAt), () => []).add(i);
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          onRefresh: _loadMockNotifications,
          child: ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
            children: [
              Row(
                children: [
                  if (unread > 0)
                    Container(
                      width: 28,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: const BoxDecoration(
                        color: AppColors.rust,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '$unread',
                        style: AppText.label(13, Colors.white),
                      ),
                    ),
                  if (unread > 0) const SizedBox(width: 10),
                  Expanded(
                    child: Text('Activity Feed', style: AppText.title(24)),
                  ),
                  IconButton(
                    onPressed: _loadMockNotifications,
                    tooltip: 'Refresh notifications',
                    icon: const Icon(Icons.refresh_rounded),
                  ),
                  InkWell(
                    onTap: () =>
                        setState(() => _read.addAll(_items.map((e) => e.id))),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.infoSurface,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.done_all, size: 16),
                          const SizedBox(width: 6),
                          Text('Mark all read', style: AppText.label(12.5)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              SizedBox(
                height: 38,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _Chip(
                      label: 'All',
                      count: _items.length,
                      selected: _filter == null,
                      onTap: () => setState(() => _filter = null),
                    ),
                    for (final t in ActivityType.all)
                      if (_items.any((i) => i.type == t))
                        _Chip(
                          label: _styles[t]!.label,
                          count: _items.where((i) => i.type == t).length,
                          selected: _filter == t,
                          onTap: () => setState(() => _filter = t),
                        ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              if (items.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 48),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.notifications_none,
                        size: 56,
                        color: AppColors.muted,
                      ),
                      const SizedBox(height: 10),
                      Text("You're all caught up", style: AppText.label(16)),
                      const SizedBox(height: 4),
                      Text(
                        'Booking updates and alerts will appear here.',
                        style: AppText.body(13, AppColors.muted),
                      ),
                    ],
                  ),
                )
              else
                for (final entry in groups.entries) ...[
                  Padding(
                    padding: const EdgeInsets.fromLTRB(4, 8, 4, 10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          entry.key,
                          style: AppText.label(
                            12.5,
                            AppColors.ink.withAlpha(210),
                          ).copyWith(letterSpacing: 0.8),
                        ),
                        Text(
                          plural(entry.value.length, 'Update', 'Updates'),
                          style: AppText.mono(11),
                        ),
                      ],
                    ),
                  ),
                  for (final i in entry.value)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: _card(i),
                    ),
                ],
              const SizedBox(height: 8),
              _prefs(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _card(ActivityItem i) {
    return AppCard(
      padding: const EdgeInsets.all(14),
      radius: 20,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AppIconBox(
                _styles[i.type]!.icon,
                background: _styles[i.type]!.iconBackground,
                size: 42,
              ),
              const SizedBox(width: 10),
              AppPill(
                i.tag,
                background: _styles[i.type]!.iconBackground,
                foreground: AppColors.ink,
                fontSize: 11,
              ),
              if (_isUnread(i)) ...[
                const SizedBox(width: 6),
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppColors.rust,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
              const Spacer(),
              Text(timeAgo(i.createdAt), style: AppText.mono(11)),
            ],
          ),
          const SizedBox(height: 10),
          Text(i.title, style: AppText.title(18)),
          const SizedBox(height: 6),
          Text(i.body, style: AppText.body(14, AppColors.ink.withAlpha(215))),
          if (i.imageUrl != null) ...[
            const SizedBox(height: 10),
            TripImage(
              url: i.imageUrl,
              height: 112,
              radius: 14,
              child: i.imageCaption == null
                  ? null
                  : Align(
                      alignment: Alignment.bottomLeft,
                      child: Padding(
                        padding: const EdgeInsets.all(10),
                        child: Text(
                          i.imageCaption!,
                          style: AppText.label(
                            12,
                            Colors.white,
                            FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
            ),
          ],
          if (i.actionLabel != null) ...[
            const SizedBox(height: 12),
            FilledButton(
              onPressed: () {
                setState(() => _read.add(i.id));
                i.onAction?.call();
              },
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    i.actionLabel!,
                    style: AppText.label(13.5, Colors.white),
                  ),
                  const SizedBox(width: 6),
                  const Icon(Icons.arrow_forward, size: 16),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _prefs(BuildContext context) {
    return InkWell(
      onTap: () => context.go('/profile'),
      borderRadius: BorderRadius.circular(20),
      child: SoftBox(
        color: AppColors.bannerSurface,
        padding: const EdgeInsets.all(14),
        radius: 20,
        child: Row(
          children: [
            const AppIconBox(
              Icons.tune,
              background: AppColors.bannerIconSurface,
              size: 42,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Notification Preferences', style: AppText.title(16)),
                  Text(
                    'Choose which travel updates you receive',
                    style: AppText.body(12.5, AppColors.ink.withAlpha(200)),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({
    required this.label,
    required this.count,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final fg = selected ? Colors.white : AppColors.ink;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: selected ? AppColors.primary : AppColors.infoSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            children: [
              Text(label, style: AppText.label(13, fg, FontWeight.w600)),
              const SizedBox(width: 6),
              Text(
                '$count',
                style: AppText.label(12, fg.withAlpha(200), FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
