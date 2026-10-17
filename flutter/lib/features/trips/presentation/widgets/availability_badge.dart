import 'package:flutter/material.dart';

import '../../domain/entities/trip_availability.dart';
import '../cubit/trip_request_status.dart';

class AvailabilityBadge extends StatelessWidget {
  const AvailabilityBadge({
    super.key,
    required this.status,
    this.availability,
  });

  final TripRequestStatus status;
  final TripAvailability? availability;

  @override
  Widget build(BuildContext context) {
    if (status == TripRequestStatus.loading) {
      return const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox.square(
            dimension: 14,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          SizedBox(width: 8),
          Text('Checking availability'),
        ],
      );
    }

    if (status == TripRequestStatus.failure) {
      return const Text('Availability could not be checked');
    }
    if (status != TripRequestStatus.success || availability == null) {
      return const SizedBox.shrink();
    }

    final available = availability!.available;
    final color = available ? Colors.green.shade800 : Colors.red.shade700;
    final label = available
        ? '${availability!.remainingSeats} seats available'
        : 'Fully booked';

    return Semantics(
      label: label,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(color: color, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
