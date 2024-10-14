import 'package:backstore/screens/historial_screen.dart';
import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../widgets/static_logo.dart'; // Usar el logo estático reutilizable
import 'home_screen.dart'; // Importar la pantalla de inicio

class SyncScreen extends StatelessWidget {
  const SyncScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: CustomColors.background,  // Fondo blanco
        elevation: 0,  // Sin sombra en el AppBar
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: CustomColors.black),  // Icono de retroceso negro
          onPressed: () {
            // Redirigir a la pantalla de inicio (HomeScreen) al presionar atrás
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomeScreen()),
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
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'SINCRONIZAR',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: CustomColors.black,  // Texto en negro
              ),
            ),
            const Spacer(),  // Empuja los botones hacia el centro verticalmente
            _buildButton('HISTORIAL', () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const HistorialScreen()),
              );
            }),
            const SizedBox(height: 20),  // Espaciado entre botones
            _buildButton('ENVIAR/RECIBIR', () {
              // Mostrar el mensaje de éxito
              _showSuccessDialog(context);
            }),
            const Spacer(),  // Espacio debajo de los botones
            const SizedBox(height: 50),
          ],
        ),
      ),
    );
  }

  Widget _buildButton(String text, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: CustomColors.purple,  // Botones de color morado
        padding: const EdgeInsets.symmetric(vertical: 20),
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

  // Función para mostrar el diálogo de éxito
  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Se ha sincronizado correctamente la aplicación...',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,  // Tamaño de fuente más grande
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();  // Cerrar el diálogo
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: CustomColors.purple,  // Botón morado
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text(
                  'Aceptar',
                  style: TextStyle(
                    color: Colors.white,  // Texto blanco
                    fontSize: 16,  // Tamaño de texto
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}