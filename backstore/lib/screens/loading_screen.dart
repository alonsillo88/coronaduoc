import 'dart:async';
import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../widgets/animated_logo.dart'; // Asegúrate de importar AnimatedCoronaLogo

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({super.key, this.logoWidth = 300});

  final double logoWidth;

  @override
  LoadingScreenState createState() => LoadingScreenState();
}

class LoadingScreenState extends State<LoadingScreen> {
  double _progressValue = 0.0;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _startLoading();
  }

  // Simulación de carga con una barra de progreso
  void _startLoading() {
    _timer = Timer.periodic(const Duration(milliseconds: 100), (Timer timer) {
      setState(() {
        _progressValue += 0.03;
        if (_progressValue >= 1.0) {
          _timer.cancel();
          // Una vez que la carga termine, navega al LoginScreen
          Navigator.of(context).pushReplacementNamed('/login');
        }
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedCoronaLogo(
              size: widget.logoWidth, // Tamaño ajustable
              color: CustomColors.black, // Color ajustable
            ),
            const SizedBox(
                height: 10), // Espaciado entre el logo y la barra de progreso
            const Text(
              'Backstore',
              style: TextStyle(
                fontSize: 20,
                color: CustomColors.black,
              ),
            ),
            // Barra de progreso
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.7,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: _progressValue,
                  minHeight: 10,
                  color: CustomColors.purple, // Barra de progreso morada
                  backgroundColor:
                      CustomColors.lightPurple, // Fondo de la barra
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
