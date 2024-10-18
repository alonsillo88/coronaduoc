import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert'; // Para manejar la conversión JSON
import '../utils/custom_colors.dart';
import '../widgets/static_logo.dart';

class SyncScreen extends StatefulWidget {
  const SyncScreen({super.key});

  @override
  _SyncScreenState createState() => _SyncScreenState();
}

class _SyncScreenState extends State<SyncScreen> {
  bool _isLoading = false;
  List<Map<String, dynamic>> _orders = [];

  @override
  void initState() {
    super.initState();
    _loadLocalOrders(); // Carga las órdenes ya almacenadas al iniciar la pantalla
  }

  Future<void> _loadLocalOrders() async {
    final prefs = await SharedPreferences.getInstance();
    final String? ordersJson = prefs.getString('orders');
    if (ordersJson != null) {
      setState(() {
        _orders = List<Map<String, dynamic>>.from(json.decode(ordersJson));
      });
    }
  }

  Future<void> _fetchOrders() async {
    setState(() {
      _isLoading = true;
    });

    final prefs = await SharedPreferences.getInstance();
    final email = prefs.getString('email');
    final accessToken = prefs.getString('accessToken');

    if (email == null || accessToken == null) {
      _showSnackBar('Error: No se encontró el correo o token del usuario', Colors.red);
      setState(() {
        _isLoading = false;
      });
      return;
    }

    const queryOrders = '''
      query getOrders(\$filter: OrderFilterInput!) {
        getOrders(filter: \$filter) {
          externalOrderId
          creationDate
          items {
            productId
            skuName
            quantity
            quantityConfirmedBackstore
            breakReason
            imageUrl
            ean
            color
            size
          }
          orderBackstoreStatus
          assignment {
            assignedTo
            assignmentDate
          }
          externalDate
        }
      }
    ''';

    final variables = {
      "filter": {
        "assignedTo": email,
      },
    };

    try {
      final client = GraphQLProvider.of(context).value;
      final result = await client.query(
        QueryOptions(
          document: gql(queryOrders),
          variables: variables,
          context: Context().withEntry(
            HttpLinkHeaders(
              headers: {
                'Authorization': 'Bearer $accessToken', // Agregar el token al header
              },
            ),
          ),
        ),
      );

      if (result.hasException) {
        _showSnackBar('Error al obtener órdenes: ${result.exception.toString()}', Colors.red);
      } else {
        final data = result.data?['getOrders'] ?? [];
        final newOrders = List<Map<String, dynamic>>.from(data);

        // Filtra solo las órdenes que no existen en las ya almacenadas
        final existingOrderIds = _orders.map((order) => order['externalOrderId']).toSet();
        final ordersToAdd = newOrders.where((order) => !existingOrderIds.contains(order['externalOrderId'])).toList();

        if (ordersToAdd.isNotEmpty) {
          setState(() {
            _orders.addAll(ordersToAdd);
          });

          // Almacena las órdenes actualizadas localmente
          await prefs.setString('orders', json.encode(_orders));

          _showSnackBar('Órdenes sincronizadas exitosamente', Colors.green);
        } else {
          _showSnackBar('No hay nuevas órdenes para sincronizar', Colors.orange);
        }
      }
    } catch (e) {
      _showSnackBar('Error inesperado al sincronizar', Colors.red);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _deleteOrder(int index) async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _orders.removeAt(index);
    });
    await prefs.setString('orders', json.encode(_orders));
    _showSnackBar('Orden eliminada', Colors.red);
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
      appBar: AppBar(
        backgroundColor: CustomColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: CustomColors.black),
          onPressed: () {
            Navigator.pop(context); // Regresa a la pantalla anterior
          },
        ),
        title: const Center(
          child: StaticCoronaLogo(
            size: 125,
            color: CustomColors.black,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle, color: CustomColors.lightGray),
            onPressed: () {
              // Acción para el icono de perfil
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
                color: CustomColors.black,
              ),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: _isLoading ? null : _fetchOrders,
              style: ElevatedButton.styleFrom(
                backgroundColor: CustomColors.purple,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'ENVIAR/RECIBIR',
                style: TextStyle(
                  color: CustomColors.white,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(height: 20),
            if (_isLoading)
              const Center(child: CircularProgressIndicator()),
            if (!_isLoading && _orders.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  itemCount: _orders.length,
                  itemBuilder: (context, index) {
                    final order = _orders[index];
                    return Card(
                      child: ListTile(
                        title: Text(order['externalOrderId']),
                        subtitle: Text('Fecha: ${order['creationDate']}'),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteOrder(index),
                        ),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
