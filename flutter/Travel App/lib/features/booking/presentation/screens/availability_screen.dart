import 'package:flutter/material.dart';
import '../../data/models/availability_model.dart';

/// [AvailabilityScreen]
/// A skeleton UI screen to display trip dates and seat availability.
/// Allows the customer to select a valid date before proceeding to booking.
class AvailabilityScreen extends StatelessWidget {
  final String tripId; // Received from Developer 2
  const AvailabilityScreen({super.key, required this.tripId});
  @override
  Widget build(BuildContext context) {
    // Mock data for testing the UI structure
    final List<AvailabilityModel> mockAvailabilityList = [
      AvailabilityModel(
        dateId: 'd1',
        tripId: tripId,
        date: '2026-10-05',
        totalSeats: 20,
        availableSeats: 5,
      ),
      AvailabilityModel(
        dateId: 'd2',
        tripId: tripId,
        date: '2026-10-12',
        totalSeats: 20,
        availableSeats: 0, // Fully booked date
      ),
      AvailabilityModel(
        dateId: 'd3',
        tripId: tripId,
        date: '2026-10-20',
        totalSeats: 20,
        availableSeats: 12,
      ),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('Select Date & Seats')),
      body: ListView.builder(
        // ui
        itemCount: mockAvailabilityList.length, // backend
        padding: const EdgeInsets.all(16.0),
        itemBuilder: (context, index) {
          final item = mockAvailabilityList[index]; // backend
          final isSoldOut = item.availableSeats == 0;
          return Card(
            margin: const EdgeInsets.only(bottom: 12.0),
            child: ListTile(
              title: Text('Trip Date: ${item.date}'),
              subtitle: Text(
                isSoldOut
                    ? 'Sold Out (No Seats Available)'
                    : 'Available Seats: ${item.availableSeats} of ${item.totalSeats}',
                style: TextStyle(
                  color: isSoldOut ? Colors.red : Colors.green,
                  fontWeight: FontWeight.bold,
                ),
              ),
              trailing: ElevatedButton(
                onPressed: isSoldOut
                    ? null // Disable button if sold out
                    : () {
                        // TODO: Navigate to Booking Form screen
                      },
                child: const Text('Book'),
              ),
            ),
          );
        },
      ),
    );
  }
}
