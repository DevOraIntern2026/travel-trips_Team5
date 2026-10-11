/// Single source of truth for date formatting.
///
/// These month names and the two most common date shapes were previously
/// declared three times across the codebase, which meant a change to any of
/// them had to be hunted down by hand.
library;

/// Abbreviated English month names, indexed by `DateTime.month - 1`.
const List<String> monthsAbbr = [
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

/// "May 18, 2025"
String formatDate(DateTime date) =>
    '${monthsAbbr[date.month - 1]} ${date.day}, ${date.year}';

/// "May 2025"
String formatMonthYear(DateTime date) =>
    '${monthsAbbr[date.month - 1]} ${date.year}';

/// Parses an ISO-8601 date, returning null instead of throwing.
DateTime? tryParseIsoDate(String iso) => DateTime.tryParse(iso);

/// Zero-pads to two digits, e.g. `7` -> `"07"`.
String twoDigits(int value) => value.toString().padLeft(2, '0');
