/// Single source of truth for money formatting.
///
/// The codebase previously carried three near-identical implementations with
/// confusing names (`money`, `money2`, `formatPrice`). The two output styles
/// are kept deliberately distinct because they render differently:
///
/// - [formatMoney]      -> `$1,280`   (thousands separators, decimals only when needed)
/// - [formatMoneyExact] -> `$2,560.00`(always two decimals)
/// - [formatPricePlain] -> `$1280`    (no thousands separator — used by summary rows)
library;

String _groupThousands(String whole) =>
    whole.replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',');

bool _hasDecimals(double value) => value != value.truncateToDouble();

/// `$1,280` — thousands separators, decimals only when needed.
String formatMoney(double value) {
  final parts = value.toStringAsFixed(_hasDecimals(value) ? 2 : 0).split('.');
  return '\$${_groupThousands(parts.first)}'
      '${parts.length > 1 ? '.${parts[1]}' : ''}';
}

/// `$2,560.00` — always two decimals.
String formatMoneyExact(double value) {
  final parts = value.toStringAsFixed(2).split('.');
  return '\$${_groupThousands(parts.first)}.${parts[1]}';
}

/// `$1280` — no thousands separator.
String formatPricePlain(double value) =>
    '\$${value.toStringAsFixed(_hasDecimals(value) ? 2 : 0)}';
