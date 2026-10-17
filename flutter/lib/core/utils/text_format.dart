/// Small text helpers shared across screens.
library;

/// Builds a count with a correctly pluralised noun.
///
/// `plural(1, 'seat')` -> `"1 seat"`, `plural(3, 'seat')` -> `"3 seats"`.
///
/// Pass [pluralForm] when the plural is not the singular plus `"s"`,
/// e.g. `plural(2, 'opening', 'openings')`.
String plural(int count, String singular, [String? pluralForm]) {
  final word = count == 1 ? singular : (pluralForm ?? '${singular}s');
  return '$count $word';
}
