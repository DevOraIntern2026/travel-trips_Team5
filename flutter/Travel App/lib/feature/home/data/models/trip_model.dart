class TripModel {
  final int id;
  final String title;
  final String? location;
  final String? category;
  final String? imageUrl;
  final int? durationDays;
  final double? price;
  final int? seatsLeft;
  final double? rating;
  final String? nextDeparture;
  final bool confirmed;
  final int? destinationId;
  final int? cancellationWindowHours;

  const TripModel({
    required this.id,
    required this.title,
    this.location,
    this.category,
    this.imageUrl,
    this.durationDays,
    this.price,
    this.seatsLeft,
    this.rating,
    this.nextDeparture,
    this.confirmed = false,
    this.destinationId,
    this.cancellationWindowHours,
  });

  factory TripModel.fromJson(Map<String, dynamic> json) {
    final id = json['id'] as num;
    final destination = json['destination'];
    final destinationMap = destination is Map
        ? Map<String, dynamic>.from(destination)
        : null;

    return TripModel(
      id: id.toInt(),
      title: json['name'] as String,
      location: destinationMap?['name'] as String?,
      durationDays: (json['durationDays'] as num?)?.toInt(),
      destinationId: (json['destinationId'] as num?)?.toInt(),
      cancellationWindowHours: (json['cancellationWindowHours'] as num?)
          ?.toInt(),
    );
  }
}
