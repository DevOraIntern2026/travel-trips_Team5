class BookingModel {
  final int id;
  final int customerId;
  final int tripId;
  final int tripDateId;
  final double price;
  final String status;
  final DateTime createdAt;

  const BookingModel({
    required this.id,
    required this.customerId,
    required this.tripId,
    required this.tripDateId,
    required this.price,
    required this.status,
    required this.createdAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as int,
      customerId: json['customerId'] as int,
      tripId: json['tripId'] as int,
      tripDateId: json['tripDateId'] as int,
      price: _toDouble(json['price']),
      status: json['status'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  static double _toDouble(Object? value) {
    if (value is num) {
      return value.toDouble();
    }

    return double.parse(value.toString());
  }
}
