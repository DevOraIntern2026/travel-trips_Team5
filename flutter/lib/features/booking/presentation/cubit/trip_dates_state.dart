import '../../data/models/trip_date_model.dart';

abstract class TripDatesState {}

class TripDatesInitial extends TripDatesState {}

class TripDatesLoading extends TripDatesState {}

class TripDatesSuccess extends TripDatesState {
  final List<TripDateModel> tripDates;

  TripDatesSuccess(this.tripDates);
}

class TripDatesError extends TripDatesState {
  final String message;

  TripDatesError(this.message);
}
