class ApiErrorModel {
  final int? statusCode;
  final String message;
  final String? error;

  const ApiErrorModel({this.statusCode, required this.message, this.error});

  factory ApiErrorModel.fromJson(Map<String, dynamic> json, {int? statusCode}) {
    return ApiErrorModel(
      statusCode: json['statusCode'] as int? ?? statusCode,
      message: json['message']?.toString() ?? 'Something went wrong.',
      error: json['error']?.toString(),
    );
  }
}
