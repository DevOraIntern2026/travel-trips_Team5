class BookingModel {
  final int id;
  final int customerId;
  final int tripId;
  final int tripDateId;
  final double price;
  final String status;
  final DateTime createdAt;
  final DateTime? updatedAt;

  const BookingModel({
    required this.id,
    required this.customerId,
    required this.tripId,
    required this.tripDateId,
    required this.price,
    required this.status,
    required this.createdAt,
    this.updatedAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as int,
      customerId: json['customerId'] as int,
      tripId: json['tripId'] as int,
      tripDateId: json['tripDateId'] as int,
      price: double.parse(json['price'].toString()),
      status: json['status'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
    );
  }
}
