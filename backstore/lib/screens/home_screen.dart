import 'package:backstore/screens/sync_screen.dart';
import 'package:backstore/screens/picking_asignado_screen.dart';  // Importa la pantalla PickingAsignadoScreen
import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../widgets/custom_drawer.dart';  // Importa el menú reutilizable
import '../widgets/static_logo.dart';   // Importa el logo estático reutilizable

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: CustomColors.background,  // Fondo blanco
        elevation: 0,  // Sin sombra en el AppBar
        leading: Builder(
          builder: (BuildContext context) {
            return IconButton(
              icon: const Icon(Icons.menu, color: CustomColors.black),  // Icono de menú negro
              onPressed: () {
                Scaffold.of(context).openDrawer();  // Abre el Drawer
              },
            );
          },
        ),
        title: const Center(
          child: StaticCoronaLogo(
            size: 125,  // Ajustamos el tamaño del logo
            color: CustomColors.black,  // Color negro del logo
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle, color: CustomColors.lightGray),  // Icono de perfil
            onPressed: () {
              // Acción al presionar el icono de perfil
            },
          ),
        ],
      ),
      drawer: const CustomDrawer(),  // Reutiliza el menú lateral
      body: Padding(
        padding: const EdgeInsets.all(20.0),  // Espaciado alrededor del contenido
        child: _buildBody(context),
      ),
    );
  }

  Widget _buildBody(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,  // Centra los elementos verticalmente
      crossAxisAlignment: CrossAxisAlignment.stretch,  // Hace que los botones ocupen todo el ancho
      children: [
        _buildButton('SINCRONIZAR', () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const SyncScreen()),
          );
        }),
        const SizedBox(height: 20),  // Espaciado entre botones
        _buildButton('PICKING ASIGNADO', () {
          // Navega a la vista de Picking Asignado
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const PickingAsignadoScreen()),
          );
        }),
        const SizedBox(height: 20),
        _buildButton('CONSOLIDADO RECOLECCIÓN', () {
          // Acción para el botón "CONSOLIDADO RECOLECCIÓN"
        }),
        const SizedBox(height: 20),
        _buildButton('CONSULTAR STOCK', () {
          // Acción para el botón "CONSULTAR STOCK"
        }),
      ],
    );
  }

  Widget _buildButton(String text, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: CustomColors.purple,  // Botones de color morado
        padding: const EdgeInsets.symmetric(vertical: 20),  // Tamaño del botón
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),  // Bordes redondeados
        ),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: CustomColors.white,  // Texto blanco
          fontSize: 16,
        ),
      ),
    );
  }
}