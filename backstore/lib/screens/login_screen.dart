import 'package:backstore/widgets/static_logo.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
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

  Future<void> _login() async {
    String email = _emailController.text;
    String password = _passwordController.text;

    const loginMutation = '''
      mutation login(\$loginInput: LoginInput!) {
        login(loginInput: \$loginInput) {
          accessToken
          firstName
          lastName
          email
          roles
          idSucursal
        }
      }
    ''';

    final variables = {
      "loginInput": {
        "email": email,
        "password": password,
      },
    };

    final client = GraphQLProvider.of(context).value;
    final result = await client.mutate(
      MutationOptions(
        document: gql(loginMutation),
        variables: variables,
      ),
    );

    if (result.hasException) {
      _showSnackBar('Error al iniciar sesión, intenta de nuevo', Colors.red);
    } else {
      final data = result.data?['login'];
      if (data != null) {
        final roles = List<String>.from(data['roles']);
        if (roles.contains('Picker')) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('accessToken', data['accessToken']);
          await prefs.setString('email', data['email']);
          await prefs.setString('firstName', data['firstName']);
          await prefs.setString('lastName', data['lastName']);
          await prefs.setStringList('roles', roles);
          await prefs.setString('idSucursal', data['idSucursal']);

          _showSnackBar('Inicio de sesión exitoso', Colors.green);
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const HomeScreen()),
          );
        } else {
          _showSnackBar('No tienes permisos para acceder', Colors.red);
        }
      }
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
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: CustomColors.purple,
              ),
            ),
            const SizedBox(height: 80),
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
              borderSide: BorderSide(color: CustomColors.purple),
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
              borderSide: BorderSide(color: CustomColors.purple),
            ),
            suffixIcon: IconButton(
              icon: Icon(
                _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                color: CustomColors.black,
              ),
              onPressed: () {
                setState(() {
                  _isPasswordVisible = !_isPasswordVisible;
                });
              },
            ),
          ),
        ),
        const SizedBox(height: 30),
        ElevatedButton(
          onPressed: _isButtonEnabled ? _login : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: CustomColors.purple,
            padding: const EdgeInsets.symmetric(vertical: 20),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          child: const Text(
            'Ingresar',
            style: TextStyle(color: CustomColors.white),
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