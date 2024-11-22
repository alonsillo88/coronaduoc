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
              onTap: () => _showLogoutConfirmation(context),
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

  void _showLogoutConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Cerrar Sesión'),
          content: const Text('¿Está seguro que desea cerrar sesión?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancelar', style: TextStyle(color: CustomColors.black)),
            ),
            TextButton(
              onPressed: () {
                _logout(context); 
              },
              child: const Text('Aceptar', style: TextStyle(color: CustomColors.purple)),
            ),
          ],
        );
      },
    );
  }

  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear(); 

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Hasta luego', textAlign: TextAlign.center),
        backgroundColor: CustomColors.purple,
        duration: Duration(seconds: 3),
      ),
    );

    await Future.delayed(const Duration(seconds: 1));

    if (context.mounted) {
      Navigator.of(context, rootNavigator: true).pushReplacementNamed('/login');
    }
  }
}