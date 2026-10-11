import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/auth_colors.dart';

class AuthOrDivider extends StatelessWidget {
  const AuthOrDivider({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    const line = Expanded(child: Divider(color: AuthColors.border, height: 1));

    return Row(
      children: [
        line,
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              letterSpacing: 1,
              color: AuthColors.muted,
            ),
          ),
        ),
        line,
      ],
    );
  }
}

class AuthCheckbox extends StatelessWidget {
  const AuthCheckbox({
    super.key,
    required this.value,
    required this.onChanged,
    required this.child,
  });

  final bool value;
  final ValueChanged<bool> onChanged;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => onChanged(!value),
      borderRadius: BorderRadius.circular(8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            width: 24,
            height: 24,
            margin: const EdgeInsets.only(top: 2),
            decoration: BoxDecoration(
              color: value ? AuthColors.primary : Colors.white,
              borderRadius: BorderRadius.circular(7),
              border: Border.all(
                color: value ? AuthColors.primary : AuthColors.barOff,
                width: 1.5,
              ),
            ),
            child: value
                ? const Icon(Icons.check, size: 16, color: Colors.white)
                : null,
          ),
          const SizedBox(width: 12),
          Expanded(child: child),
        ],
      ),
    );
  }
}

/// 4-segment bar + "8+ characters / Includes number" checks.
class PasswordStrengthMeter extends StatelessWidget {
  const PasswordStrengthMeter({super.key, required this.password});

  final String password;

  bool get _hasLength => password.length >= 8;
  bool get _hasNumber => RegExp(r'\d').hasMatch(password);
  bool get _hasMixedCase =>
      RegExp(r'[a-z]').hasMatch(password) &&
      RegExp(r'[A-Z]').hasMatch(password);
  bool get _hasSymbol => RegExp(r'[^A-Za-z0-9]').hasMatch(password);

  int get score => [
    _hasLength,
    _hasNumber,
    _hasMixedCase,
    _hasSymbol,
  ].where((e) => e).length;

  String get label {
    if (password.isEmpty) return '';
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      default:
        return 'Strong';
    }
  }

  @override
  Widget build(BuildContext context) {
    final filled = password.isEmpty ? 0 : score;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 10),
        Row(
          children: List.generate(4, (i) {
            return Expanded(
              child: Container(
                height: 4,
                margin: EdgeInsets.only(right: i == 3 ? 0 : 6),
                decoration: BoxDecoration(
                  color: i < filled ? AuthColors.primary : AuthColors.barOff,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            );
          }),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            _Check(label: '8+ characters', ok: _hasLength),
            const SizedBox(width: 14),
            _Check(label: 'Includes number', ok: _hasNumber),
          ],
        ),
      ],
    );
  }
}

class _Check extends StatelessWidget {
  const _Check({required this.label, required this.ok});

  final String label;
  final bool ok;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          ok ? Icons.check_circle_outline : Icons.radio_button_unchecked,
          size: 16,
          color: ok ? AuthColors.success : AuthColors.muted,
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            color: AuthColors.muted,
          ),
        ),
      ],
    );
  }
}
