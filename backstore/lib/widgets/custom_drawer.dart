import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Container(
        color: CustomColors.white,
        width: MediaQuery.of(context).size.width * 0.75,
        height: MediaQuery.of(context).size.height,
        child: ListView(
          padding: EdgeInsets.zero,
          children: const <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(color: CustomColors.white),
              child: Text(
                'MENÚ',
                style: TextStyle(color: CustomColors.black, fontSize: 24),
              ),
            ),
            ExpansionTile(
              title: Text('SINCRONIZAR', style: TextStyle(color: CustomColors.black)),
              children: [
                ListTile(title: Text('Historial', style: TextStyle(color: CustomColors.black))),
                ListTile(title: Text('Enviar/Recibir', style: TextStyle(color: CustomColors.black))),
              ],
            ),
            ExpansionTile(
              title: Text('PICKING ASIGNADO', style: TextStyle(color: CustomColors.black)),
              children: [
                ListTile(title: Text('Pendientes', style: TextStyle(color: CustomColors.black))),
                ListTile(title: Text('En Curso', style: TextStyle(color: CustomColors.black))),
                ListTile(title: Text('Finalizados', style: TextStyle(color: CustomColors.black))),
                ListTile(title: Text('Quiebres', style: TextStyle(color: CustomColors.black))),
              ],
            ),
            ExpansionTile(
              title: Text('CONSOLIDADO RECOLECCIÓN', style: TextStyle(color: CustomColors.black)),
              children: [
                ListTile(title: Text('Seleccionar Ordenes', style: TextStyle(color: CustomColors.black))),
                ListTile(title: Text('Recolectar', style: TextStyle(color: CustomColors.black))),
              ],
            ),
            ListTile(
              title: Text('CONSULTAR STOCK', style: TextStyle(color: CustomColors.black)),
            ),
          ],
        ),
      ),
    );
  }
}
