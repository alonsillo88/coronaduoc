import 'package:backstore/widgets/static_logo.dart';
import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../screens/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  LoginScreenState createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isButtonEnabled = false;
  bool _isPasswordVisible = false;

  @override
  void initState() {
    super.initState();
    _emailController.addListener(_validateFields);
    _passwordController.addListener(_validateFields);
  }

  void _validateFields() {
    setState(() {
      _isButtonEnabled = _emailController.text.isNotEmpty && _passwordController.text.isNotEmpty;
    });
  }

  void _login() {
    String email = _emailController.text;
    String password = _passwordController.text;

    if (email == 'usuario@dominio.cl' && password == 'password123') {
      _showSnackBar('Inicio de sesión exitoso', Colors.green);
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const HomeScreen()),
      );
    } else {
      _showSnackBar('Credenciales incorrectas, intenta de nuevo', Colors.red);
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: color,
        content: Text(message),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CustomColors.background,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 20),
            const StaticCoronaLogo(size: 80, color: CustomColors.black),
            const SizedBox(height: 10),
            const Text(
              'BACKSTORE\nMÓVIL',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18, // Tamaño de fuente ajustado
                fontWeight: FontWeight.bold,
                color: CustomColors.purple, // Color del texto en morado
              ),
            ),
            const SizedBox(height: 80), // Espacio ajustado entre el logo y el formulario
            _buildForm(),
          ],
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email',
            hintText: 'usuario@dominio.cl',
            border: OutlineInputBorder(),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: CustomColors.purple), // Borde morado
            ),
          ),
        ),
        const SizedBox(height: 20),
        TextField(
          controller: _passwordController,
          obscureText: !_isPasswordVisible,
          decoration: InputDecoration(
            labelText: 'Contraseña',
            border: const OutlineInputBorder(),
            focusedBorder: const OutlineInputBorder(
              borderSide: BorderSide(color: CustomColors.purple), // Borde morado
            ),
            suffixIcon: IconButton(
              icon: Icon(
                _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                color: CustomColors.black, // Color negro para el icono
              ),
              onPressed: () {
                setState(() {
                  _isPasswordVisible = !_isPasswordVisible;
                });
              },
            ),
          ),
        ),
        const SizedBox(height: 30), // Espacio entre el campo de contraseña y el botón
        ElevatedButton(
          onPressed: _isButtonEnabled ? _login : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: CustomColors.purple, // Color de fondo del botón morado
            padding: const EdgeInsets.symmetric(vertical: 15),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
          ),
          child: const Text(
            'Ingresar',
            style: TextStyle(color: CustomColors.white), // Texto blanco
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
