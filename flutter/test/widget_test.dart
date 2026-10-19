import 'package:flutter_test/flutter_test.dart';

import 'package:TravelOra/core/di/injection_container.dart';
import 'package:TravelOra/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  configureDependencies();

  testWidgets('TravelOra shell loads', (WidgetTester tester) async {
    await tester.pumpWidget(const TravelOraApp());
    await tester.pump();
    expect(find.text('TravelOra'), findsWidgets);
    expect(find.text('Explore'), findsOneWidget);
  });
}
