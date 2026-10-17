import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/ui/login_screen.dart';
import '../../features/auth/presentation/ui/register_screen.dart';
import '../../features/booking/data/models/trip_date_model.dart';
import '../../features/booking/presentation/ui/availability_screen.dart';
import '../../features/booking/presentation/ui/booking_details_screen.dart';
import '../../features/booking/presentation/ui/booking_history_screen.dart';
import '../../features/booking/presentation/ui/booking_screen.dart';
import '../../features/booking/presentation/ui/passenger_details_screen.dart';
import '../../features/home/data/models/trip_model.dart' as home;
import '../../features/main/presentation/ui/main_shell.dart';
import '../../features/main/presentation/ui/profile_screen.dart';
import '../../features/notifications/presentation/ui/activity_feed_screen.dart';
import '../../features/onboarding/presentation/pages/onboarding_page.dart';
import '../../features/splash/presentation/ui/splash_screen.dart';
import '../../features/trips/domain/entities/destination.dart';
import '../../features/trips/presentation/cubit/trip_browsing_cubit.dart';
import '../../features/trips/presentation/pages/destination_details_page.dart';
import '../../features/trips/presentation/pages/explore_page.dart';
import '../../features/trips/presentation/pages/filter_page.dart';
import '../../features/trips/presentation/pages/trip_details_page.dart';
import '../../features/trips/presentation/pages/trip_results_page.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: (_, _) => const SplashScreen()),
    GoRoute(
      path: '/onboarding',
      builder: (context, _) =>
          OnboardingPage(onFinished: () => context.go('/login')),
    ),
    GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, _) => const RegisterScreen()),
    StatefulShellRoute.indexedStack(
      builder: (context, state, shell) => MainShell(navigationShell: shell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/home',
              builder: (context, _) => ExplorePage(),
              //HomeScreen(onOpenAlerts: () => context.go('/alerts')),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/bookings',
              builder: (context, _) =>
                  BookingHistoryScreen(onExplore: () => context.go('/home')),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/alerts',
              builder: (_, _) => const ActivityFeedScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(path: '/profile', builder: (_, _) => const ProfileScreen()),
          ],
        ),
      ],
    ),
    GoRoute(
      path: '/trips',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, _) => const ExplorePage(),
    ),
    GoRoute(
      path: '/trips/results',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) {
        final data = state.extra as TripResultsRouteData?;
        return TripResultsPage(
          title: data?.title ?? state.uri.queryParameters['title'] ?? 'Trips',
          initialQuery: data?.query ?? state.uri.queryParameters['q'],
          initialFilters: data?.filters,
          destinationId: data?.destinationId,
        );
      },
    ),
    GoRoute(
      path: '/trips/filter',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) =>
          FilterPage(initialFilters: state.extra as TripFilterCriteria?),
    ),
    GoRoute(
      path: '/trips/:tripId',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) => TripDetailsPage(
        tripId: int.tryParse(state.pathParameters['tripId'] ?? '') ?? 0,
      ),
    ),
    GoRoute(
      path: '/trips/:tripId/availability',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) {
        final extra = state.extra;
        return AvailabilityScreen(
          tripId: int.tryParse(state.pathParameters['tripId'] ?? '') ?? 0,
          trip: extra is home.TripModel
              ? extra
              : extra is AvailabilityRouteData
              ? extra.trip
              : null,
          dateId: extra is AvailabilityRouteData ? extra.dateId : null,
        );
      },
    ),
    GoRoute(
      path: '/trips/:tripId/passengers',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) {
        final data = state.extra;
        if (data is! PassengerRouteData) {
          return const _RouteState(
            message:
                'Passenger details are unavailable. Please select a departure again.',
          );
        }
        return PassengerDetailsScreen(
          tripId:
              int.tryParse(state.pathParameters['tripId'] ?? '') ?? data.tripId,
          dateId: data.dateId,
          date: data.date,
          trip: data.trip,
        );
      },
    ),
    GoRoute(
      path: '/trips/:tripId/booking',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) {
        final data = state.extra;
        if (data is! BookingRouteData) {
          return const _RouteState(
            message: 'Booking details are unavailable. Please start again.',
          );
        }
        return BookingScreen(
          tripId:
              int.tryParse(state.pathParameters['tripId'] ?? '') ?? data.tripId,
          dateId: data.dateId,
          date: data.date,
          trip: data.trip,
        );
      },
    ),
    GoRoute(
      path: '/destinations/:destinationId',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) {
        final destination = state.extra;
        if (destination is! Destination) {
          return const _RouteState(
            message:
                'Destination details are unavailable. Open a destination from a trip.',
          );
        }
        return DestinationDetailsPage(destination: destination);
      },
    ),
    GoRoute(
      path: '/bookings/:bookingId',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (_, state) => BookingDetailsScreen(
        bookingId: int.tryParse(state.pathParameters['bookingId'] ?? '') ?? 0,
      ),
    ),
  ],
);

class TripResultsRouteData {
  const TripResultsRouteData({
    required this.title,
    this.query,
    this.filters,
    this.destinationId,
  });
  final String title;
  final String? query;
  final TripFilterCriteria? filters;
  final int? destinationId;
}

class AvailabilityRouteData {
  const AvailabilityRouteData({this.trip, this.dateId});
  final home.TripModel? trip;
  final int? dateId;
}

class PassengerRouteData {
  const PassengerRouteData({
    required this.tripId,
    required this.dateId,
    required this.date,
    this.trip,
  });
  final int tripId;
  final int dateId;
  final TripDateModel date;
  final home.TripModel? trip;
}

class BookingRouteData {
  const BookingRouteData({
    required this.tripId,
    required this.dateId,
    this.date,
    this.trip,
  });
  final int tripId;
  final int dateId;
  final TripDateModel? date;
  final home.TripModel? trip;
}

class _RouteState extends StatelessWidget {
  const _RouteState({required this.message});
  final String message;
  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(message, textAlign: TextAlign.center),
              const SizedBox(height: 12),
              FilledButton(
                onPressed: () => context.go('/home'),
                child: const Text('Back to Explore'),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
