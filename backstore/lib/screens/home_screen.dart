import 'package:backstore/screens/sync_screen.dart';
import 'package:backstore/screens/picking_asignado_screen.dart';
import 'package:backstore/utils/custom_colors.dart';
import 'package:backstore/widgets/custom_drawer.dart';
import 'package:backstore/widgets/static_logo.dart';
import 'package:flutter/material.dart';


class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      drawer: const CustomDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ..._buildButtons(context), // Generar los botones de manera dinámica
          ],
        ),
      ),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      backgroundColor: CustomColors.background,
      elevation: 0,
      leading: Builder(
        builder: (context) {
          return IconButton(
            icon: const Icon(Icons.menu, color: CustomColors.black),
            onPressed: () => Scaffold.of(context).openDrawer(),
          );
        },
      ),
      title: const Center(
        child: StaticCoronaLogo(size: 125, color: CustomColors.black),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.account_circle, color: CustomColors.lightGray),
          onPressed: () {},
        ),
      ],
    );
  }

  List<Widget> _buildButtons(BuildContext context) {
    final buttonData = [
      {'text': 'SINCRONIZAR', 'onPressed': () => _navigateTo(context, const SyncScreen())},
      {'text': 'PICKING ASIGNADO', 'onPressed': () => _navigateTo(context, const PickingAsignadoScreen())},
    ];

    return buttonData
        .map(
          (data) => Padding(
            padding: const EdgeInsets.only(bottom: 20.0),
            child: ElevatedButton(
              onPressed: data['onPressed'] as VoidCallback,
              style: ElevatedButton.styleFrom(
                backgroundColor: CustomColors.purple,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: Text(
                data['text'] as String,
                style: const TextStyle(color: CustomColors.white, fontSize: 16),
              ),
            ),
          ),
        )
        .toList();
  }

  void _navigateTo(BuildContext context, Widget screen) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
  }
}