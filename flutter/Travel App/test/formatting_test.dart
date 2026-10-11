import 'package:devora_trips/core/utils/date_format.dart';
import 'package:devora_trips/core/utils/text_format.dart';
import 'package:devora_trips/feature/booking/data/models/booking_status.dart';
import 'package:devora_trips/feature/booking/presentation/utils/booking_display.dart';
import 'package:devora_trips/feature/booking/presentation/utils/booking_formatters.dart';
import 'package:flutter_test/flutter_test.dart';

/// Guards the behaviour of the shared helpers after the de-duplication refactor.
/// The expected strings are the exact output of the previous, duplicated
/// implementations, so any accidental change fails here.
void main() {
  group('date formatting', () {
    test('monthsAbbr is the 12 English abbreviations', () {
      expect(monthsAbbr.length, 12);
      expect(monthsAbbr.first, 'Jan');
      expect(monthsAbbr.last, 'Dec');
    });

    test('formatDate renders "May 18, 2025"', () {
      expect(formatDate(DateTime(2025, 5, 18)), 'May 18, 2025');
    });

    test('formatBookingDate matches formatDate', () {
      final d = DateTime(2026, 1, 9);
      expect(formatBookingDate(d), formatDate(d));
      expect(formatBookingDate(d), 'Jan 9, 2026');
    });

    test('formatMonthYear / monthYearLabel render "May 2025"', () {
      expect(formatMonthYear(DateTime(2025, 5, 1)), 'May 2025');
      expect(
        monthYearLabel(DateTime(2025, 5, 1)),
        formatMonthYear(DateTime(2025, 5, 1)),
      );
    });

    test('monthKey zero-pads the month', () {
      expect(monthKey(DateTime(2025, 3, 4)), '2025-03');
      expect(monthKey(DateTime(2025, 12, 4)), '2025-12');
    });

    test('formatBookingRange keeps the short form inside one month', () {
      expect(
        formatBookingRange('2025-05-18', '2025-05-23'),
        'May 18 – 23, 2025',
      );
    });

    test('formatBookingRange falls back to full dates across months', () {
      expect(
        formatBookingRange('2025-05-18', '2025-06-02'),
        'May 18, 2025 – Jun 2, 2025',
      );
    });

    test('formatBookingRange never throws on malformed input', () {
      expect(formatBookingRange('nope', 'also-nope'), 'nope – also-nope');
    });

    test('tryParseDate returns null instead of throwing', () {
      expect(tryParseDate('not-a-date'), isNull);
      expect(tryParseDate('2025-05-18'), isNotNull);
    });
  });

  group('currency formatting', () {
    test('formatMoney groups thousands and drops empty decimals', () {
      expect(formatMoney(1288), r'$1,288');
      expect(formatMoney(2560), r'$2,560');
      expect(formatMoney(0), r'$0');
    });

    test('formatMoney keeps two decimals only when needed', () {
      expect(formatMoney(1288.5), r'$1,288.50');
      expect(formatMoney(99.99), r'$99.99');
    });

    test('formatMoneyExact always shows two decimals', () {
      expect(formatMoneyExact(2560), r'$2,560.00');
      expect(formatMoneyExact(1288.5), r'$1,288.50');
    });

    test('formatPricePlain omits thousands separators', () {
      expect(formatPricePlain(1288), r'$1288');
      expect(formatPricePlain(2560.5), r'$2560.50');
    });
  });

  group('plural', () {
    test('uses the singular for exactly one', () {
      expect(plural(1, 'seat'), '1 seat');
      expect(plural(1, 'opening', 'openings'), '1 opening');
    });

    test('appends s when no explicit plural is given', () {
      expect(plural(0, 'seat'), '0 seats');
      expect(plural(3, 'seat'), '3 seats');
    });

    test('uses the explicit plural form', () {
      expect(plural(4, 'Update', 'Updates'), '4 Updates');
    });
  });

  group('BookingStatus', () {
    test('holds the exact values the backend sends', () {
      expect(BookingStatus.confirmed, 'Confirmed');
      expect(BookingStatus.cancelled, 'Cancelled');
      expect(BookingStatus.pending, 'Pending');
    });

    test('isKnown only accepts the two values the API produces', () {
      expect(BookingStatus.isKnown('Confirmed'), isTrue);
      expect(BookingStatus.isKnown('Cancelled'), isTrue);
      expect(BookingStatus.isKnown('Pending'), isFalse);
      expect(BookingStatus.isKnown('Refunded'), isFalse);
    });

    test('isConfirmed / isCancelled are mutually exclusive', () {
      expect(BookingStatus.isConfirmed('Confirmed'), isTrue);
      expect(BookingStatus.isCancelled('Confirmed'), isFalse);
      expect(BookingStatus.isCancelled('Cancelled'), isTrue);
    });
  });
}
