/// Booking status values as returned by the backend (`BookingsService`).
///
/// The API sends plain strings, and only these three occur:
/// `Confirmed` on creation, `Cancelled` after `POST /bookings/:id/cancel`.
/// `Pending` is rendered by the UI for statuses it does not yet recognise.
///
/// Using these constants instead of inline literals keeps comparisons
/// traceable and typo-proof without changing a single rendered string.
abstract final class BookingStatus {
  /// A reservation held by the operator.
  static const String confirmed = 'Confirmed';

  /// Released by the customer; the seat was returned to capacity.
  static const String cancelled = 'Cancelled';

  /// Fallback for any status the app does not specifically handle.
  static const String pending = 'Pending';

  /// True for [confirmed] / [cancelled]; used for optimistic ordering.
  static bool isKnown(String status) =>
      status == confirmed || status == cancelled;

  /// True when the booking no longer holds a seat.
  static bool isCancelled(String status) => status == cancelled;

  /// True when the booking holds a seat.
  static bool isConfirmed(String status) => status == confirmed;
}
