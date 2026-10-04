class CreateBookingRequestModel {
  final int tripDateId;

  const CreateBookingRequestModel({required this.tripDateId});

  Map<String, dynamic> toJson() {
    return {'tripDateId': tripDateId};
  }
}
