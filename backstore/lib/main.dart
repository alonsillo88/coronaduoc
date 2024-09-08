import 'package:flutter/material.dart';
import 'screens/loading_screen.dart';
import 'utils/custom_colors.dart';

void main() {
  runApp(const BackstoreApp());
}

class BackstoreApp extends StatelessWidget {
  const BackstoreApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Backstore',
      theme: _buildTheme(),      
      home: const LoadingScreen(),
    );
  }

  ThemeData _buildTheme() {
    return ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: CustomColors.darkPurple,
      ),
      scaffoldBackgroundColor: CustomColors.white,
      primaryColor: CustomColors.darkPurple,
      appBarTheme: const AppBarTheme(
        backgroundColor: CustomColors.lightGray,
        titleTextStyle: TextStyle(color: CustomColors.black, fontSize: 20),
        iconTheme: IconThemeData(color: CustomColors.black),
      ),
      useMaterial3: true,
    );
  }
}
