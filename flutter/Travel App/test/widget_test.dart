import 'package:devora_trips/app.dart';
import 'package:devora_trips/core/di/service_locator.dart';
import 'package:devora_trips/core/networking/api_result.dart';
import 'package:devora_trips/feature/booking/data/models/booking_model.dart';
import 'package:devora_trips/feature/booking/data/repo/booking_repo.dart';
import 'package:devora_trips/feature/booking/presentation/cubit/booking_history_cubit.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';

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
    getIt.registerLazySingleton<BookingRepo>(_FakeBookingRepo.new);
    getIt.registerFactory<BookingHistoryCubit>(
      () => BookingHistoryCubit(getIt<BookingRepo>()),
    );
  });

  testWidgets('App renders my bookings screen', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    expect(find.text('My Bookings'), findsOneWidget);
    expect(find.text('No bookings yet'), findsOneWidget);
  });
}