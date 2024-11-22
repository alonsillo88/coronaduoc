import 'package:backstore/screens/home_screen.dart';
import 'package:backstore/services/graphql_service.dart';
import 'package:backstore/utils/custom_colors.dart';
import 'package:backstore/widgets/static_logo.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  LoginScreenState createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isButtonEnabled = false;
  bool _isPasswordVisible = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    for (var controller in [_emailController, _passwordController]) {
      controller.addListener(_validateFields);
    }
  }

  void _validateFields() => setState(() {
        _isButtonEnabled = _emailController.text.isNotEmpty && _passwordController.text.isNotEmpty;
      });

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
    });

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
        "email": _emailController.text,
        "password": _passwordController.text,
      },
    };

    try {
      final result = await GraphQLService.client.value.mutate(
        MutationOptions(
          document: gql(loginMutation),
          variables: variables,
          fetchPolicy: FetchPolicy.noCache,
        ),
      );

      if (!mounted) return;

      if (result.hasException) {
        _showSnackBar('Error al iniciar sesión, intenta de nuevo', Colors.red);
      } else {
        final data = result.data?['login'];
        if (data != null && List<String>.from(data['roles']).contains('Picker')) {
          await _storeUserData(data);
          if (!mounted) return;
          _showSnackBar('Inicio de sesión exitoso', Colors.green);
          await Future.delayed(const Duration(seconds: 1));
          _navigateToHome();
        } else {
          _showSnackBar('No tienes permisos para acceder', Colors.red);
        }
      }
    } catch (e) {
      if (mounted) {
        _showSnackBar('Ocurrió un error inesperado. Intenta de nuevo', Colors.red);
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _storeUserData(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', data['accessToken']);
    await prefs.setString('email', data['email']);
    await prefs.setString('firstName', data['firstName']);
    await prefs.setString('lastName', data['lastName']);
    await prefs.setStringList('roles', List<String>.from(data['roles']));
    await prefs.setString('idSucursal', data['idSucursal']);
  }

  void _navigateToHome() {
    if (mounted) {
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (context) => const HomeScreen()));
    }
  }

  void _showSnackBar(String message, Color color) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(backgroundColor: color, content: Text(message)));
    }
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
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: CustomColors.purple),
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
        _buildTextField(_emailController, 'Email', 'Ingresa tu email'),
        const SizedBox(height: 20),
        _buildPasswordField(),
        const SizedBox(height: 30),
        ElevatedButton(
          onPressed: _isButtonEnabled && !_isLoading ? _login : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: CustomColors.purple,
            padding: const EdgeInsets.symmetric(vertical: 20),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (_isLoading)
                const Padding(
                  padding: EdgeInsets.only(right: 10),
                  child: SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(color: CustomColors.white, strokeWidth: 2),
                  ),
                ),
              const Text('Ingresar', style: TextStyle(color: CustomColors.white)),
            ],
          ),
        ),
      ],
    );
  }

  TextField _buildTextField(TextEditingController controller, String label, String hint) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: const OutlineInputBorder(),
        focusedBorder: const OutlineInputBorder(borderSide: BorderSide(color: CustomColors.purple)),
      ),
    );
  }

  TextField _buildPasswordField() {
    return TextField(
      controller: _passwordController,
      obscureText: !_isPasswordVisible,
      decoration: InputDecoration(
        labelText: 'Contraseña',
        border: const OutlineInputBorder(),
        focusedBorder: const OutlineInputBorder(borderSide: BorderSide(color: CustomColors.purple)),
        suffixIcon: IconButton(
          icon: Icon(_isPasswordVisible ? Icons.visibility : Icons.visibility_off, color: CustomColors.black),
          onPressed: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}