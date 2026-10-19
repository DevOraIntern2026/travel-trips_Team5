import 'package:flutter/material.dart';

import '../../domain/entities/trip.dart';
import '../../domain/failures/failure.dart';
import '../cubit/trip_request_status.dart';
import 'trip_card.dart';

class TripList extends StatelessWidget {
  const TripList({
    super.key,
    required this.status,
    required this.trips,
    required this.onTripTap,
    required this.onRetry,
    this.failure,
  });

  final TripRequestStatus status;
  final List<Trip> trips;
  final ValueChanged<Trip> onTripTap;
  final VoidCallback onRetry;
  final Failure? failure;

  @override
  Widget build(BuildContext context) {
    if (status == TripRequestStatus.loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (status == TripRequestStatus.failure) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off_outlined, size: 40),
              const SizedBox(height: 12),
              Text(
                failure?.message ?? 'Trips could not be loaded.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Try again'),
              ),
            ],
          ),
        ),
      );
    }
    if (status == TripRequestStatus.empty || trips.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.explore_off_outlined, size: 42),
              SizedBox(height: 12),
              Text('No trips found. Try changing your search or filters.'),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      itemCount: trips.length,
      separatorBuilder: (context, index) => const SizedBox(height: 10),
      itemBuilder: (context, index) => TripCard(
        trip: trips[index],
        onTap: () => onTripTap(trips[index]),
      ),
    );
  }
}
