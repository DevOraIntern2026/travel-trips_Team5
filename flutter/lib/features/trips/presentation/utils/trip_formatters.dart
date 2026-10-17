import '../../domain/entities/trip.dart';
import '../../domain/entities/trip_date.dart';

abstract final class TripFormatters {
  static const _months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  static String monthYear(DateTime date) {
    return '${_months[date.month - 1]} ${date.year}';
  }

  static String monthDayYear(DateTime date) {
    return '${_months[date.month - 1]} ${date.day}, ${date.year}';
  }

  static String shortMonthDay(DateTime date) {
    return '${_months[date.month - 1].toUpperCase()} ${date.day}';
  }

  static String range(DateTime start, DateTime end) {
    if (start.year == end.year && start.month == end.month) {
      return '${_months[start.month - 1]} ${start.day} – ${end.day}, ${end.year}';
    }
    return '${monthDayYear(start)} – ${monthDayYear(end)}';
  }

  static String money(num value) {
    final rounded = value.round();
    final text = rounded.toString();
    final buffer = StringBuffer();
    for (var i = 0; i < text.length; i++) {
      final remaining = text.length - i;
      if (i != 0 && remaining % 3 == 0) buffer.write(',');
      buffer.write(text[i]);
    }
    return '\$${buffer.toString()}';
  }

  static String location(Trip trip) {
    final destination = trip.destination;
    if (destination == null) return 'Destination #${trip.destinationId}';
    return '${destination.city}, ${destination.country}';
  }

  static String destinationName(Trip trip) {
    return trip.destination?.name ?? location(trip);
  }

  static String durationLabel(int days) {
    final nights = days > 1 ? days - 1 : days;
    return '$days Days / ${nights}N';
  }

  static String nightsLabel(int days) {
    final nights = days > 1 ? days - 1 : days;
    return '$days Days / $nights Nights';
  }

  static String isoDate(DateTime date) {
    final month = date.month.toString().padLeft(2, '0');
    final day = date.day.toString().padLeft(2, '0');
    return '${date.year}-$month-$day';
  }

  static TripDate? earliest(List<TripDate> dates) {
    if (dates.isEmpty) return null;
    final copy = [...dates]..sort((a, b) => a.startDate.compareTo(b.startDate));
    return copy.first;
  }
}
