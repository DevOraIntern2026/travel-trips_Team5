import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import '../networking/api_constants.dart';
import '../networking/dio_factory.dart';
import '../../feature/booking/data/repo/booking_repo.dart';
import '../../feature/booking/presentation/cubit/availability_cubit.dart';
import '../../feature/booking/presentation/cubit/booking_cubit.dart';
import '../../feature/booking/presentation/cubit/booking_details_cubit.dart';
import '../../feature/booking/presentation/cubit/booking_history_cubit.dart';
import '../../feature/booking/presentation/cubit/trip_dates_cubit.dart';

final getIt = GetIt.instance;

void setupServiceLocator() {
  getIt.registerLazySingleton<Dio>(
    () => DioFactory.create(baseUrl: ApiConstants.androidEmulatorBaseUrl),
  );

  getIt.registerLazySingleton<BookingRepo>(() => BookingRepo(getIt<Dio>()));

  getIt.registerFactory<TripDatesCubit>(
    () => TripDatesCubit(getIt<BookingRepo>()),
  );

  getIt.registerFactory<AvailabilityCubit>(
    () => AvailabilityCubit(getIt<BookingRepo>()),
  );

  getIt.registerFactory<BookingCubit>(() => BookingCubit(getIt<BookingRepo>()));

  getIt.registerFactory<BookingHistoryCubit>(
    () => BookingHistoryCubit(getIt<BookingRepo>()),
  );

  getIt.registerFactory<BookingDetailsCubit>(
    () => BookingDetailsCubit(getIt<BookingRepo>()),
  );
}
