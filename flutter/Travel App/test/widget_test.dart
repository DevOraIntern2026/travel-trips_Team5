import 'package:devora_trips/core/di/service_locator.dart';
import 'package:devora_trips/core/networking/api_result.dart';
import 'package:devora_trips/core/storage/token_storage.dart';
import 'package:devora_trips/feature/auth/data/repo/auth_repo.dart';
import 'package:devora_trips/feature/auth/presentation/cubit/auth_cubit.dart';
import 'package:devora_trips/feature/auth/presentation/ui/login_screen.dart';
import 'package:devora_trips/feature/auth/presentation/widgets/travelora_logo.dart';
import 'package:devora_trips/feature/booking/data/models/booking_model.dart';
import 'package:devora_trips/feature/booking/data/repo/booking_repo.dart';
import 'package:devora_trips/feature/booking/presentation/cubit/booking_history_cubit.dart';
import 'package:devora_trips/feature/booking/presentation/ui/booking_history_screen.dart';
import 'package:devora_trips/feature/booking/presentation/widgets/booking_empty_state.dart';
import 'package:devora_trips/feature/splash/presentation/ui/splash_screen.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

class _FakeBookingRepo extends BookingRepo {
  _FakeBookingRepo() : super(Dio());

  @override
  Future<ApiResult<List<BookingModel>>> getBookings({
    int page = 1,
    int limit = 10,
  }) async {
    return Success(const <BookingModel>[]);
  }
}

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
    getIt.registerLazySingleton<Dio>(Dio.new);
    getIt.registerLazySingleton<BookingRepo>(_FakeBookingRepo.new);
    getIt.registerFactory<BookingHistoryCubit>(
      () => BookingHistoryCubit(getIt<BookingRepo>()),
    );
    getIt.registerLazySingleton<TokenStorage>(TokenStorage.new);
    getIt.registerLazySingleton<AuthRepo>(
      () => AuthRepo(getIt<Dio>(), getIt<TokenStorage>()),
    );
    getIt.registerFactory<AuthCubit>(() => AuthCubit(getIt<AuthRepo>()));
  });

  tearDown(getIt.reset);

  testWidgets('Splash renders logo then routes to onboarding', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const MaterialApp(home: SplashScreen()));
    await tester.pump();

    expect(find.byType(TravelOraLogo), findsOneWidget);

    await tester.pump(const Duration(seconds: 3));
    // Splash dots intentionally repeat, so pumpAndSettle can never settle.
    await tester.pump(const Duration(seconds: 1));

    expect(find.text('Live Seat Availability'), findsOneWidget);
  });

  testWidgets('Login screen renders form', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    await tester.pump();

    expect(find.byType(LoginScreen), findsOneWidget);
    expect(find.byType(TextFormField), findsWidgets);
  });

  testWidgets('Booking history shows empty state', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: BlocProvider(
          create: (_) => BookingHistoryCubit(getIt<BookingRepo>()),
          child: const BookingHistoryScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('My Bookings'), findsWidgets);
    expect(find.byType(BookingEmptyState), findsOneWidget);
  });
}
