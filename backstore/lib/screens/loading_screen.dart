import 'dart:async';
import 'package:backstore/utils/custom_colors.dart';
import 'package:backstore/widgets/animated_logo.dart';
import 'package:flutter/material.dart';

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

  void _startLoading() {
    _timer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (_progressValue >= 1.0) {
        timer.cancel();
        Navigator.of(context).pushReplacementNamed('/login');
      } else {
        setState(() {
          _progressValue += 0.03;
        });
      }
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
              size: widget.logoWidth,
              color: CustomColors.black,
            ),
            const SizedBox(height: 10),
            const Text(
              'Backstore',
              style: TextStyle(
                fontSize: 20,
                color: CustomColors.black,
              ),
            ),
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.7,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: _progressValue,
                  minHeight: 10,
                  color: CustomColors.purple,
                  backgroundColor: CustomColors.lightPurple,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
