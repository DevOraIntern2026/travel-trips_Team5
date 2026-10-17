import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';

import '../network/api_client.dart';
import '../../features/trips/data/datasources/trips_remote_data_source.dart';
import '../../features/trips/data/repositories/trips_repository_impl.dart';
import '../../features/trips/domain/repositories/trips_repository.dart';
import '../../features/trips/domain/usecases/filter_trips.dart';
import '../../features/trips/domain/usecases/get_destinations.dart';
import '../../features/trips/domain/usecases/get_trip_availability.dart';
import '../../features/trips/domain/usecases/get_trip_dates.dart';
import '../../features/trips/domain/usecases/get_trip_details.dart';
import '../../features/trips/domain/usecases/get_trip_operator.dart';
import '../../features/trips/domain/usecases/get_trips.dart';
import '../../features/trips/domain/usecases/search_trips.dart';
import '../../features/trips/presentation/cubit/trip_browsing_cubit.dart';
import '../../features/trips/presentation/cubit/trip_destinations_cubit.dart';
import '../../features/trips/presentation/cubit/trip_details_cubit.dart';
import '../../features/trips/presentation/cubit/trip_search_cubit.dart';

final getIt = GetIt.instance;

void configureDependencies() {
  if (getIt.isRegistered<ApiClient>()) return;

  getIt.registerLazySingleton<ApiClient>(ApiClient.new);
  getIt.registerLazySingleton<Dio>(() => getIt<ApiClient>().dio);
  getIt.registerLazySingleton<TripsRemoteDataSource>(
    () => TripsRemoteDataSource(getIt<Dio>()),
  );
  getIt.registerLazySingleton<TripsRepository>(
    () => TripsRepositoryImpl(getIt<TripsRemoteDataSource>()),
  );
  getIt.registerLazySingleton(() => GetTrips(getIt<TripsRepository>()));
  getIt.registerLazySingleton(() => GetDestinations(getIt<TripsRepository>()));
  getIt.registerLazySingleton(() => SearchTrips(getIt<TripsRepository>()));
  getIt.registerLazySingleton(() => FilterTrips(getIt<TripsRepository>()));
  getIt.registerLazySingleton(() => GetTripDetails(getIt<TripsRepository>()));
  getIt.registerLazySingleton(() => GetTripDates(getIt<TripsRepository>()));
  getIt.registerLazySingleton(
    () => GetTripAvailability(getIt<TripsRepository>()),
  );
  getIt.registerLazySingleton(() => GetTripOperator(getIt<TripsRepository>()));
  getIt.registerFactory(
    () => TripBrowsingCubit(
      getTrips: getIt<GetTrips>(),
      filterTrips: getIt<FilterTrips>(),
    ),
  );
  getIt.registerFactory(() => TripSearchCubit(getIt<SearchTrips>()));
  getIt.registerFactory(
    () => TripDestinationsCubit(getIt<GetDestinations>()),
  );
  getIt.registerFactory(
    () => TripDetailsCubit(
      getTripDetails: getIt<GetTripDetails>(),
      getTripDates: getIt<GetTripDates>(),
      getTripAvailability: getIt<GetTripAvailability>(),
      getTripOperator: getIt<GetTripOperator>(),
    ),
  );
}
