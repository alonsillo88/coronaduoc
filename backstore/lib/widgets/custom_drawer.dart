import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Container(
        color: CustomColors.white,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: CustomColors.white),
              child: Text('MENÚ', style: TextStyle(color: CustomColors.black, fontSize: 24)),
            ),
            ..._buildMenuItems(),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildMenuItems() {
    return [
      _buildExpansionTile('SINCRONIZAR', ['Historial', 'Enviar/Recibir']),
      _buildExpansionTile('PICKING ASIGNADO', ['Pendientes', 'Finalizados', 'Quiebres']),
      _buildExpansionTile('CONSOLIDADO RECOLECCIÓN', ['Seleccionar Ordenes', 'Recolectar']),
      _buildListTile('CONSULTAR STOCK'),
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
}