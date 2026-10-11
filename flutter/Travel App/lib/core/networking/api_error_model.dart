class ApiErrorModel {
  final int? statusCode;
  final String message;
  final String? error;

  const ApiErrorModel({this.statusCode, required this.message, this.error});

  factory ApiErrorModel.fromJson(Map<String, dynamic> json, {int? statusCode}) {
    final resolvedStatus = json['statusCode'] as int? ?? statusCode;
    final rawMessage = json['message'];
    final message = switch (rawMessage) {
      List<dynamic> messages =>
        messages.map((item) => item.toString()).join('; '),
      String text when text.isNotEmpty => text,
      _ => null,
    };

    return ApiErrorModel(
      statusCode: resolvedStatus,
      message: resolvedStatus == 429
          ? 'Too many attempts. Please wait a moment and try again.'
          : message ?? 'Something went wrong.',
      error: json['error']?.toString(),
    );
  }
}
