import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import '../../feature/auth/data/repo/auth_repo.dart';
import '../storage/token_storage.dart';
import '../networking/api_constants.dart';
import '../networking/auth_interceptor.dart';
import '../networking/dio_factory.dart';
import '../../feature/booking/data/repo/booking_repo.dart';
import '../../feature/booking/presentation/cubit/availability_cubit.dart';
import '../../feature/booking/presentation/cubit/booking_cubit.dart';
import '../../feature/booking/presentation/cubit/booking_details_cubit.dart';
import '../../feature/booking/presentation/cubit/booking_history_cubit.dart';
import '../../feature/booking/presentation/cubit/trip_dates_cubit.dart';
import '../../feature/auth/presentation/cubit/auth_cubit.dart';
import '../../feature/home/data/repo/trips_repo.dart';
import '../../feature/home/presentation/cubit/home_cubit.dart';

final getIt = GetIt.instance;

void setupServiceLocator() {
  // TokenStorage first: the auth interceptor resolves it lazily on request.
  getIt.registerLazySingleton<TokenStorage>(TokenStorage.new);

  getIt.registerLazySingleton<Dio>(() {
    final dio = DioFactory.create(baseUrl: ApiConstants.androidEmulatorBaseUrl);
    dio.interceptors.add(
      AuthInterceptor(
        getIt<TokenStorage>(),
        dio,
        ApiConstants.androidEmulatorBaseUrl,
      ),
    );
    return dio;
  });

  getIt.registerLazySingleton<BookingRepo>(() => BookingRepo(getIt<Dio>()));

  getIt.registerFactory<AvailabilityCubit>(
    () => AvailabilityCubit(getIt<BookingRepo>()),
  );

  getIt.registerFactory<TripDatesCubit>(
    () => TripDatesCubit(getIt<BookingRepo>()),
  );

  getIt.registerFactory<BookingCubit>(() => BookingCubit(getIt<BookingRepo>()));

  getIt.registerFactory<BookingHistoryCubit>(
    () => BookingHistoryCubit(getIt<BookingRepo>()),
  );

  getIt.registerFactory<BookingDetailsCubit>(
    () => BookingDetailsCubit(getIt<BookingRepo>()),
  );
  getIt.registerLazySingleton<AuthRepo>(
    () => AuthRepo(getIt<Dio>(), getIt<TokenStorage>()),
  );
  getIt.registerFactory<AuthCubit>(() => AuthCubit(getIt<AuthRepo>()));

  getIt.registerLazySingleton<TripsRepo>(() => TripsRepo(getIt<Dio>()));
  getIt.registerFactory<HomeCubit>(() => HomeCubit(getIt<TripsRepo>()));
}
