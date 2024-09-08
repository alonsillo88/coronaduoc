import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../widgets/custom_drawer.dart';  // Importa el menú reutilizable

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CustomColors.lightGray,
      appBar: AppBar(
        backgroundColor: CustomColors.lightGray,
        title: const Text('CORONA', style: TextStyle(color: CustomColors.black)),
        elevation: 0,
        leading: Builder(
          builder: (BuildContext context) {
            return IconButton(
              icon: const Icon(Icons.menu, color: CustomColors.black),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            );
          },
        ),
      ),
      drawer: const CustomDrawer(),  // Reutiliza el menú
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildButton('SINCRONIZAR', () {}),
        const SizedBox(height: 20),
        _buildButton('PICKING ASIGNADO', () {}),
        const SizedBox(height: 20),
        _buildButton('CONSOLIDADO RECOLECCIÓN', () {}),
        const SizedBox(height: 20),
        _buildButton('CONSULTAR STOCK', () {}),
      ],
    );
  }

  Widget _buildButton(String text, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: CustomColors.darkPurple,
        padding: const EdgeInsets.symmetric(vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
        ),
      ),
      child: Text(text, style: const TextStyle(color: CustomColors.white)),
    );
  }
}
