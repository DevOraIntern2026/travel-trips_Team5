import '../../../../core/utils/date_format.dart';

export '../../../../core/utils/currency_format.dart' show formatPricePlain;

/// "May 18, 2025"
String formatBookingDate(DateTime date) => formatDate(date);

String formatBookingDateTime(DateTime date) {
  final hour = date.hour == 0
      ? 12
      : (date.hour > 12 ? date.hour - 12 : date.hour);
  final minute = twoDigits(date.minute);
  final suffix = date.hour >= 12 ? 'PM' : 'AM';
  return '${formatBookingDate(date)} • $hour:$minute $suffix';
}

String formatBookingRange(String startIso, String endIso) {
  try {
    final start = DateTime.parse(startIso);
    final end = DateTime.parse(endIso);
    if (start.month == end.month && start.year == end.year) {
      return '${monthsAbbr[start.month - 1]} ${start.day} – ${end.day}, ${start.year}';
    }
    return '${formatBookingDate(start)} – ${formatBookingDate(end)}';
  } catch (_) {
    return '$startIso – $endIso';
  }
}
