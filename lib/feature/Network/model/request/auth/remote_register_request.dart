class RemoteRegisterRequest {
  final String? name;
  final String? email;
  final String? password;
  final String? rePassword;
  final String? phone;

  RemoteRegisterRequest({
    this.name,
    this.email,
    this.password,
    this.rePassword,
    this.phone,
  });

  factory RemoteRegisterRequest.fromJson(Map<String, dynamic> json) {
    return RemoteRegisterRequest(
      name: json['name'] as String?,
      email: json['email'] as String?,
      password: json['password'] as String?,
      rePassword: json['rePassword'] as String?,
      phone: json['phone'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'password': password,
    'rePassword': rePassword,
    'phone': phone,
  };
}
