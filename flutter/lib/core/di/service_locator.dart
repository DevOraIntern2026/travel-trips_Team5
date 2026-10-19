import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';

import '../../features/auth/data/repo/auth_repo.dart';
import '../../features/auth/presentation/cubit/auth_cubit.dart';
import '../../features/booking/data/repo/booking_repo.dart';
import '../../features/booking/presentation/cubit/availability_cubit.dart';
import '../../features/booking/presentation/cubit/booking_cubit.dart';
import '../../features/booking/presentation/cubit/booking_details_cubit.dart';
import '../../features/booking/presentation/cubit/booking_history_cubit.dart';
import '../../features/booking/presentation/cubit/trip_dates_cubit.dart';
import '../../features/home/data/repo/trips_repo.dart';
import '../../features/home/presentation/cubit/home_cubit.dart';
import '../networking/auth_interceptor.dart';
import '../networking/mock_api_interceptor.dart';
import '../storage/token_storage.dart';
import 'injection_container.dart' as trips_di;

final getIt = GetIt.instance;

void setupServiceLocator() {
  trips_di.configureDependencies();
  if (!getIt.isRegistered<TokenStorage>()) {
    getIt.registerLazySingleton<TokenStorage>(TokenStorage.new);
  }

  final dio = getIt<Dio>();
  if (!dio.interceptors.any((interceptor) => interceptor is AuthInterceptor)) {
    dio.interceptors.add(
      AuthInterceptor(getIt<TokenStorage>(), dio, dio.options.baseUrl),
    );
  }
  if (MockApiInterceptor.enabled &&
      !dio.interceptors.any(
        (interceptor) => interceptor is MockApiInterceptor,
      )) {
    dio.interceptors.add(MockApiInterceptor());
  }
  if (!getIt.isRegistered<BookingRepo>()) {
    getIt.registerLazySingleton<BookingRepo>(() => BookingRepo(getIt<Dio>()));
  }
  if (!getIt.isRegistered<AvailabilityCubit>()) {
    getIt.registerFactory<AvailabilityCubit>(
      () => AvailabilityCubit(getIt<BookingRepo>()),
    );
  }
  if (!getIt.isRegistered<TripDatesCubit>()) {
    getIt.registerFactory<TripDatesCubit>(
      () => TripDatesCubit(getIt<BookingRepo>()),
    );
  }
  if (!getIt.isRegistered<BookingCubit>()) {
    getIt.registerFactory<BookingCubit>(
      () => BookingCubit(getIt<BookingRepo>()),
    );
  }
  if (!getIt.isRegistered<BookingHistoryCubit>()) {
    getIt.registerFactory<BookingHistoryCubit>(
      () => BookingHistoryCubit(getIt<BookingRepo>()),
    );
  }
  if (!getIt.isRegistered<BookingDetailsCubit>()) {
    getIt.registerFactory<BookingDetailsCubit>(
      () => BookingDetailsCubit(getIt<BookingRepo>()),
    );
  }
  if (!getIt.isRegistered<AuthRepo>()) {
    getIt.registerLazySingleton<AuthRepo>(
      () => AuthRepo(getIt<Dio>(), getIt<TokenStorage>()),
    );
  }
  if (!getIt.isRegistered<AuthCubit>()) {
    getIt.registerFactory<AuthCubit>(() => AuthCubit(getIt<AuthRepo>()));
  }
  if (!getIt.isRegistered<TripsRepo>()) {
    getIt.registerLazySingleton<TripsRepo>(() => TripsRepo(getIt<Dio>()));
  }
  if (!getIt.isRegistered<HomeCubit>()) {
    getIt.registerFactory<HomeCubit>(() => HomeCubit(getIt<TripsRepo>()));
  }
}
