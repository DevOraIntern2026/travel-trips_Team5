import 'package:flutter/material.dart';
import 'core/di/service_locator.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  setupServiceLocator();
  runApp(const TravelOraApp());
}

class TravelOraApp extends StatelessWidget {
  const TravelOraApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp.router(
    title: 'TravelOra',
    debugShowCheckedModeBanner: false,
    theme: AppTheme.light(),
    routerConfig: appRouter,
  );
}
