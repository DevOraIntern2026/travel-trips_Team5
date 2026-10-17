class AuthValidators {
  const AuthValidators._();

  static final RegExp _emailRegex = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

  static bool isEmail(String value) => _emailRegex.hasMatch(value.trim());

  static String? email(String? value) {
    final email = value?.trim() ?? '';
    if (email.isEmpty) return 'Please enter your email';
    if (!isEmail(email)) return 'Please enter a valid email';
    return null;
  }

  static String? loginPassword(String? value) {
    if (value == null || value.isEmpty) return 'Please enter your password';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  static String? registerPassword(String? value) {
    if (value == null || value.isEmpty) return 'Please enter a password';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!RegExp(r'\d').hasMatch(value)) {
      return 'Password must include a number';
    }
    return null;
  }

  static String? name(String? value) {
    if (value == null || value.trim().isEmpty) return 'Please enter your name';
    return null;
  }

  /// Phone is optional (the API does not take it); validate only if filled.
  static String? optionalPhone(String? value) {
    final phone = value?.replaceAll(' ', '') ?? '';
    if (phone.isEmpty) return null;
    if (!RegExp(r'^\d{6,15}$').hasMatch(phone)) return 'Enter a valid number';
    return null;
  }
}
