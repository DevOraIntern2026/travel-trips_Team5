import '../../data/models/availability_model.dart';

abstract class AvailabilityState {}

class AvailabilityInitial extends AvailabilityState {}

class AvailabilityLoading extends AvailabilityState {}

class AvailabilitySuccess extends AvailabilityState {
  final AvailabilityModel availability;

  AvailabilitySuccess(this.availability);
}

class AvailabilityError extends AvailabilityState {
  final String message;

  AvailabilityError(this.message);
}
