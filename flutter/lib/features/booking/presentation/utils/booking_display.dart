import '../../../../core/utils/date_format.dart';
import '../../data/models/trip_date_model.dart';

export '../../../../core/utils/currency_format.dart';

DateTime? tryParseDate(String iso) => tryParseIsoDate(iso);

int? tripDays(TripDateModel d) {
  final s = tryParseDate(d.startDate);
  final e = tryParseDate(d.endDate);
  if (s == null || e == null) return null;
  return e.difference(s).inDays + 1;
}

/// "6 Days / 5 Nights"
String? daysAndNights(TripDateModel d, {String sep = ' / '}) {
  final days = tripDays(d);
  if (days == null || days < 1) return null;
  final nights = days - 1;
  return '$days ${days == 1 ? 'Day' : 'Days'}$sep$nights '
      '${nights == 1 ? 'Night' : 'Nights'}';
}

/// "6D"
String? shortDuration(TripDateModel d) {
  final days = tripDays(d);
  return days == null ? null : '${days}D';
}

/// "May 2025"
String monthYearLabel(DateTime d) => formatMonthYear(d);

String monthKey(DateTime d) => '${d.year}-${twoDigits(d.month)}';

String timeAgo(DateTime date) {
  final diff = DateTime.now().difference(date.toLocal());
  if (diff.inMinutes < 1) return 'just now';
  if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
  if (diff.inHours < 24) return '${diff.inHours}h ago';
  if (diff.inDays < 30) return '${diff.inDays}d ago';
  return '${(diff.inDays / 30).floor()}mo ago';
}

/// "In 4 days" / "In 5 mo" / null when already started.
String? startsIn(TripDateModel d) {
  final s = tryParseDate(d.startDate);
  if (s == null) return null;
  final days = s.difference(DateTime.now()).inDays;
  if (days < 0) return null;
  if (days == 0) return 'Today';
  if (days < 60) return 'In $days days';
  return 'In ${(days / 30).floor()} mo';
}
