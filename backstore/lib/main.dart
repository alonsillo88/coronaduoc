import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'screens/loading_screen.dart';
import 'screens/login_screen.dart';
import 'utils/custom_colors.dart';

void main() async {
  await initHiveForFlutter();

  final HttpLink httpLink = HttpLink(
    'http://localhost:3000/backstore',
  );

  ValueNotifier<GraphQLClient> client = ValueNotifier(
    GraphQLClient(
      link: httpLink,
      cache: GraphQLCache(store: HiveStore()),
    ),
  );

  runApp(
    GraphQLProvider(
      client: client,
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
      home: const LoadingScreen(), // Pantalla de inicio
      routes: {
        '/login': (context) => const LoginScreen(), // Ruta para el LoginScreen
      },
    );
  }

  ThemeData _buildTheme() {
    return ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: CustomColors.purple, // Color principal basado en "purple"
      ),
      scaffoldBackgroundColor: CustomColors.background, // Fondo blanco
      primaryColor: CustomColors.purple, // Color principal (morado)
      appBarTheme: const AppBarTheme(
        backgroundColor: CustomColors.background, // Color de fondo del AppBar
        titleTextStyle: TextStyle(
          color: CustomColors.black, // Texto en negro
          fontSize: 20,
        ),
        iconTheme: IconThemeData(
          color: CustomColors.black, // Iconos en negro
        ),
      ),
      useMaterial3: true,
    );
  }
}