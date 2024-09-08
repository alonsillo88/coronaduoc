import 'dart:async';
import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../screens/login_screen.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({super.key});

  @override
  _LoadingScreenState createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> {
  double _progressValue = 0.0;
  late Timer _timer;

  @override
  void initState() {
    super.initState();
    _startLoading();
  }

  void _startLoading() {
    _timer = Timer.periodic(const Duration(milliseconds: 100), (Timer timer) {
      setState(() {
        _progressValue += 0.05;
        if (_progressValue >= 1.0) {
          _timer.cancel();
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const LoginScreen()),
          );
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
      backgroundColor: CustomColors.lightGray,
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'CORONA',
            style: TextStyle(
              fontSize: 40,
              fontWeight: FontWeight.bold,
              color: CustomColors.black,
            ),
          ),
          const SizedBox(height: 20),
          LinearProgressIndicator(
            value: _progressValue,
            minHeight: 5,
            color: CustomColors.darkPurple,
            backgroundColor: CustomColors.lightPurple,
          ),
        ],
      ),
    );
  }
}
