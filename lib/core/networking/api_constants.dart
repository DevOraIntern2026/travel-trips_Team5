class ApiConstants {
  const ApiConstants._();

  static const String androidEmulatorBaseUrl = 'http://10.0.2.2:3000/api/v1/';

  static const String localBaseUrl = 'http://localhost:3000/api/v1/';

  // Trip Browsing
  static const String trips = 'trips';
  static const String searchTrips = 'trips/search';
  static const String filterTrips = 'trips/filter';

  // Trip Dates & Availability
  static String tripDates(int tripId) {
    return 'trips/$tripId/dates';
  }

  static String tripDateAvailability(int tripId, int dateId) {
    return 'trips/$tripId/dates/$dateId/availability';
  }

  // Bookings
  static const String bookings = 'bookings';

  static String bookingDetails(int bookingId) {
    return 'bookings/$bookingId';
  }

  static String bookingStatus(int bookingId) {
    return 'bookings/$bookingId/status';
  }
}
