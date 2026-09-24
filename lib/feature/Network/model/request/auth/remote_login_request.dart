class RemoteLoginRequest {
  final String? email;
  final String? password;

  const RemoteLoginRequest({this.email, this.password});

  factory RemoteLoginRequest.fromJson(Map<String, dynamic> json) {
    return RemoteLoginRequest(
      email: json['email'] as String?,
      password: json['password'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {'email': email, 'password': password};

  
}
