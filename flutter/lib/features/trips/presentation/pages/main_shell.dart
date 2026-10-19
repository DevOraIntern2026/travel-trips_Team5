import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/app_bottom_nav.dart';
import '../widgets/app_header.dart';
import 'explore_page.dart';

final explorerNavigatorKey = GlobalKey<NavigatorState>();

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: [
          Navigator(
            key: explorerNavigatorKey,
            onGenerateRoute: (settings) {
              return MaterialPageRoute<void>(
                builder: (_) => const ExplorePage(),
                settings: settings,
              );
            },
          ),
          const _SimpleTab(
            title: 'Bookings',
            message: 'Your confirmed departures will appear here.',
            icon: Icons.confirmation_number_outlined,
          ),
          const _SimpleTab(
            title: 'Alerts',
            message: 'Seat and departure alerts will show up here.',
            icon: Icons.notifications_none_rounded,
          ),
          const _SimpleTab(
            title: 'Profile',
            message: 'Manage your explorer profile and preferences.',
            icon: Icons.person_outline_rounded,
          ),
        ],
      ),
      bottomNavigationBar: AppBottomNav(
        currentIndex: _index,
        onChanged: (index) {
          if (index == 0 && _index == 0) {
            explorerNavigatorKey.currentState?.popUntil(
              (route) => route.isFirst,
            );
          }
          setState(() => _index = index);
        },
      ),
    );
  }
}

class _SimpleTab extends StatelessWidget {
  const _SimpleTab({
    required this.title,
    required this.message,
    required this.icon,
  });

  final String title;
  final String message;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppHeader(
          onBellTap: () => context.go('/alerts'),
          onProfileTap: () => context.go('/profile'),
        ),
        Expanded(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(icon, size: 42, color: const Color(0xFF9CA3AF)),
                  const SizedBox(height: 12),
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    message,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
