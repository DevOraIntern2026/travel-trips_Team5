import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Copies [reference] to the clipboard and confirms it with a snackbar.
///
/// Both the booking-detail header and the reservation-submitted header show
/// the same "tap to copy the reference" affordance, and both previously
/// inlined this exact clipboard + snackbar sequence.
void copyBookingReference(BuildContext context, String reference) {
  Clipboard.setData(ClipboardData(text: '#$reference'));
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(const SnackBar(content: Text('Reference copied')));
}
