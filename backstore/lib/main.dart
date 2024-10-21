import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'services/graphql_service.dart';
import 'screens/loading_screen.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'utils/custom_colors.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GraphQLService.initialize();

  runApp(
    GraphQLProvider(
      client: GraphQLService.client,
      child: const BackstoreApp(),
    ),
  );
}

class BackstoreApp extends StatelessWidget {
  const BackstoreApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Backstore',
      theme: _buildTheme(),
      initialRoute: '/',
      routes: {
        '/': (_) => const LoadingScreen(),
        '/login': (_) => const LoginScreen(),
        '/home': (_) => const HomeScreen(),
      },
    );
  }

  ThemeData _buildTheme() {
    return ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: CustomColors.purple),
      scaffoldBackgroundColor: CustomColors.background,
      primaryColor: CustomColors.purple,
      appBarTheme: const AppBarTheme(
        backgroundColor: CustomColors.background,
        titleTextStyle: TextStyle(color: CustomColors.black, fontSize: 20),
        iconTheme: IconThemeData(color: CustomColors.black),
      ),
      useMaterial3: true,
    );
  }
}
