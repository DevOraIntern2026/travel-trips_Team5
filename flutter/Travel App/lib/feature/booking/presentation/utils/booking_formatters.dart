const _months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

String formatBookingDate(DateTime date) =>
    '${_months[date.month - 1]} ${date.day}, ${date.year}';

String formatBookingDateTime(DateTime date) {
  final hour = date.hour == 0 ? 12 : (date.hour > 12 ? date.hour - 12 : date.hour);
  final minute = date.minute.toString().padLeft(2, '0');
  final suffix = date.hour >= 12 ? 'PM' : 'AM';
  return '${formatBookingDate(date)} • $hour:$minute $suffix';
}

String formatBookingRange(String startIso, String endIso) {
  try {
    final start = DateTime.parse(startIso);
    final end = DateTime.parse(endIso);
    if (start.month == end.month && start.year == end.year) {
      return '${_months[start.month - 1]} ${start.day} – ${end.day}, ${start.year}';
    }
    return '${formatBookingDate(start)} – ${formatBookingDate(end)}';
  } catch (_) {
    return '$startIso – $endIso';
  }
}

String formatPrice(double value) {
  final hasDecimals = value != value.truncateToDouble();
  return '\$${value.toStringAsFixed(hasDecimals ? 2 : 0)}';
}