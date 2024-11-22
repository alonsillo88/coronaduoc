import 'package:backstore/utils/custom_colors.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Container(
        color: CustomColors.white,
        child: Column(
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: CustomColors.white),
              child: Text(
                'MENÚ',
                style: TextStyle(color: CustomColors.black, fontSize: 24),
              ),
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  ..._buildMenuItems(),
                ],
              ),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout, color: CustomColors.black),
              title: const Text('Cerrar Sesión', style: TextStyle(color: CustomColors.black)),
              onTap: () => _logout(context),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildMenuItems() {
    return [
      _buildExpansionTile('SINCRONIZAR', ['Historial', 'Enviar/Recibir']),
      _buildExpansionTile('PICKING ASIGNADO', ['Pendientes', 'Finalizados', 'Quiebres']),
    ];
  }

  ExpansionTile _buildExpansionTile(String title, List<String> children) {
    return ExpansionTile(
      title: Text(title, style: const TextStyle(color: CustomColors.black)),
      children: children.map((child) => _buildListTile(child)).toList(),
    );
  }

  ListTile _buildListTile(String title) {
    return ListTile(
      title: Text(title, style: const TextStyle(color: CustomColors.black)),
    );
  }

  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear(); // Limpia todos los datos guardados

    // Muestra un mensaje antes de redirigir
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Hasta luego', textAlign: TextAlign.center),
        backgroundColor: CustomColors.purple,
        duration: Duration(seconds: 3),
      ),
    );

    // Retraso para mostrar el mensaje antes de navegar
    await Future.delayed(const Duration(seconds: 1));

    // Navegar al login
    if (context.mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    }
  }
}