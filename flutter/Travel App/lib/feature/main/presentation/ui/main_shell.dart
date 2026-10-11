import 'package:flutter/material.dart';

import '../../../../core/widgets/app_bottom_nav.dart';
import '../../../booking/presentation/ui/booking_history_screen.dart';
import '../../../home/presentation/ui/home_screen.dart';
import '../../../notifications/presentation/ui/activity_feed_screen.dart';
import 'profile_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key, this.initialIndex = 0});

  final int initialIndex;
  static void open(BuildContext context, {int tab = 0}) {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute<void>(builder: (_) => MainShell(initialIndex: tab)),
      (route) => false,
    );
  }

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  late int _index = widget.initialIndex;
  int _bookingsVersion = 0;

  void _go(int i) {
    setState(() {
      if (i == 1 && _index != 1) _bookingsVersion++;
      _index = i;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: [
          HomeScreen(onOpenAlerts: () => _go(2)),
          KeyedSubtree(
            key: ValueKey(_bookingsVersion),
            child: BookingHistoryScreen(onExplore: () => _go(0)),
          ),
          const ActivityFeedScreen(),
          const ProfileScreen(),
        ],
      ),
      bottomNavigationBar: AppBottomNav(currentIndex: _index, onTap: _go),
    );
  }
}
