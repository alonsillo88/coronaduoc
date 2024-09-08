import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../screens/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
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
      backgroundColor: CustomColors.lightGray,
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: _buildForm(),
      ),
    );
  }

  Widget _buildForm() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'CORONA',
          style: TextStyle(
            fontSize: 40,
            fontWeight: FontWeight.bold,
            color: CustomColors.black,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email',
            hintText: 'usuario@dominio.cl',
            border: OutlineInputBorder(),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: CustomColors.darkPurple),
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
              borderSide: BorderSide(color: CustomColors.darkPurple),
            ),
            suffixIcon: IconButton(
              icon: Icon(
                _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
              ),
              onPressed: () {
                setState(() {
                  _isPasswordVisible = !_isPasswordVisible;
                });
              },
            ),
          ),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: _isButtonEnabled ? _login : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: CustomColors.darkPurple,
            padding: const EdgeInsets.symmetric(vertical: 15),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
          ),
          child: const Text('Ingresar', style: TextStyle(color: CustomColors.white)),
        ),
      ],
    );
  }
}
