/// User as returned by the auth endpoints (`SafeUserResponse` in the backend).
///
/// Verified against the running backend:
/// - `id` is a JSON number (e.g. `2`), kept as a String for display/storage.
/// - `name` is `string | null` and IS null when the account is registered
///   without a name, so it must not be cast to a non-nullable String.
/// - `role` is passed through verbatim: `Customer`, `Admin` or `Operator`.
///   It is deliberately not mapped to an enum.
class UserModel {
  final String id;
  final String email;
  final String? name;
  final String role;
  final int? operatorId;
  final bool emailVerified;
  final bool isActive;

  const UserModel({
    required this.id,
    required this.email,
    required this.role,
    this.name,
    this.operatorId,
    this.emailVerified = false,
    this.isActive = true,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    final rawId = json['id'];
    final rawOperatorId = json['operatorId'];

    return UserModel(
      // `id` is numeric on the wire; normalise defensively in case it is
      // ever sent as a string.
      id: rawId is num ? rawId.toString() : '${rawId ?? ''}',
      email: json['email'] as String? ?? '',
      name: json['name'] as String?,
      role: json['role'] as String? ?? '',
      operatorId: rawOperatorId is num ? rawOperatorId.toInt() : null,
      emailVerified: json['emailVerified'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
      'operatorId': operatorId,
      'emailVerified': emailVerified,
      'isActive': isActive,
    };
  }
}
