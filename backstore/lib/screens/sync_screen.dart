import 'package:backstore/utils/custom_colors.dart';
import 'package:backstore/widgets/static_logo.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'historial_screen.dart';

class SyncScreen extends StatefulWidget {
  const SyncScreen({super.key});

  @override
  _SyncScreenState createState() => _SyncScreenState();
}

class _SyncScreenState extends State<SyncScreen> {
  bool _isLoading = false;
  List<Map<String, dynamic>> _pendingOrders = [];
  List<Map<String, dynamic>> _completedOrders = [];
  List<Map<String, dynamic>> _quiebres = [];
  List<Map<String, dynamic>> _sentRecords = [];

  @override
  void initState() {
    super.initState();
    _loadLocalOrders();
  }

  Future<void> _loadLocalOrders() async {
    final prefs = await SharedPreferences.getInstance();
    final String? ordersJson = prefs.getString('orders');
    final String? sentRecordsJson = prefs.getString('sentRecords');
    final String? quiebresJson = prefs.getString('quiebres');
    if (ordersJson != null) {
      List<Map<String, dynamic>> allOrders = List<Map<String, dynamic>>.from(json.decode(ordersJson));

      setState(() {
        _pendingOrders = allOrders.where((order) => order['orderBackstoreStatus'] == null && order['orderBackstoreStatusDate'] == null).toList();
        _completedOrders = allOrders.where((order) => order['orderBackstoreStatus'] != null && order['orderBackstoreStatusDate'] != null).toList();
      });
    }
    if (sentRecordsJson != null) {
      setState(() {
        _sentRecords = List<Map<String, dynamic>>.from(json.decode(sentRecordsJson));
      });
    }
    if (quiebresJson != null) {
      setState(() {
        _quiebres = List<Map<String, dynamic>>.from(json.decode(quiebresJson));
      });
    }
  }

  Future<void> _syncOrders() async {
    setState(() {
      _isLoading = true;
    });

    // 1. Enviar órdenes completadas al backend antes de recibir la data actualizada.
    if (_completedOrders.isNotEmpty) {
      for (var order in _completedOrders) {
        await _updateOrderInBackend(order);
      }
      setState(() {
        _sentRecords.addAll(_completedOrders);
        _completedOrders.clear();
      });
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('orders', json.encode(_pendingOrders));
      await prefs.setString('sentRecords', json.encode(_sentRecords));
    }

    // 2. Limpiar caché.
    GraphQLProvider.of(context).value.cache.store.reset();

    // 3. Obtener las órdenes actualizadas del backend.
    await _fetchOrdersFromBackend();

    setState(() {
      _isLoading = false;
    });
  }

  Future<void> _updateOrderInBackend(Map<String, dynamic> order) async {
    const updateOrderMutation = '''
      mutation updateOrderForPicking(\$updateOrderInput: UpdateOrderInput!) {
        updateOrderForPicking(updateOrderInput: \$updateOrderInput) {
          externalOrderId
        }
      }
    ''';

    final variables = {
      "updateOrderInput": {
        "externalOrderId": order['externalOrderId'],
        "items": order['items'].map((item) {
          return {
            "productId": item['productId'],
            "quantityBackstoreConfirmados": item['quantityConfirmedBackstore'] ?? 0,
            "breakReason": item['breakReason'] ?? ""
          };
        }).toList(),
        "orderStatusBackstore": order['orderBackstoreStatus']
      }
    };

    final prefs = await SharedPreferences.getInstance();
    final accessToken = prefs.getString('accessToken');

    try {
      final client = GraphQLProvider.of(context).value;
      final result = await client.mutate(
        MutationOptions(
          document: gql(updateOrderMutation),
          variables: variables,
          context: Context().withEntry(
            HttpLinkHeaders(
              headers: {
                'Authorization': 'Bearer $accessToken',
              },
            ),
          ),
        ),
      );

      if (result.hasException) {
        _showSnackBar('Error al actualizar la orden: ${result.exception.toString()}', Colors.red);
      } else {
        _showSnackBar('Orden actualizada exitosamente', Colors.green);
      }
    } catch (e) {
      _showSnackBar('Error inesperado al actualizar la orden: $e', Colors.red);
    }
  }

  Future<void> _fetchOrdersFromBackend() async {
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
          orderBackstoreStatusDate
          assignment {
            assignedTo
            assignmentDate
          }
          externalDate
        }
      }
    ''';

    final prefs = await SharedPreferences.getInstance();
    final email = prefs.getString('email');
    final accessToken = prefs.getString('accessToken');

    if (email == null || accessToken == null) {
      _showSnackBar('Error: No se encontró el correo o token del usuario', Colors.red);
      return;
    }

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
                'Authorization': 'Bearer $accessToken',
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

        // Filtrar órdenes y asegurarse de que no haya duplicados de externalOrderId
        final existingOrderIds = <String>{};
        existingOrderIds.addAll(_pendingOrders.map((order) => order['externalOrderId']));
        existingOrderIds.addAll(_quiebres.map((order) => order['externalOrderId']));

        final newPendingOrders = newOrders.where((order) =>
            !existingOrderIds.contains(order['externalOrderId']) &&
            order['orderBackstoreStatus'] == null &&
            order['orderBackstoreStatusDate'] == null).toList();

        final newQuiebres = newOrders.where((order) =>
            !existingOrderIds.contains(order['externalOrderId']) &&
            order['orderBackstoreStatus'] != null &&
            order['orderBackstoreStatusDate'] != null).toList();

        setState(() {
          _pendingOrders.addAll(newPendingOrders);
          _quiebres.addAll(newQuiebres);
        });

        await prefs.setString('orders', json.encode(_pendingOrders + _completedOrders));
        await prefs.setString('quiebres', json.encode(_quiebres));

        _showSnackBar('Órdenes sincronizadas exitosamente', Colors.green);
      }
    } catch (e) {
      _showSnackBar('Error inesperado al sincronizar: $e', Colors.red);
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
      appBar: AppBar(
        backgroundColor: CustomColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: CustomColors.black),
          onPressed: () => Navigator.pop(context),
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
            onPressed: () {},
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
            const SizedBox(height: 20),
            ...[
              {
                'text': 'HISTORIAL',
                'onPressed': () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => const HistorialScreen()),
                  );
                },
              },
              {
                'text': 'ENVIAR/RECIBIR',
                'onPressed': _isLoading ? null : _syncOrders,
              },
            ]
                .map(
                  (data) => Padding(
                    padding: const EdgeInsets.only(bottom: 20.0),
                    child: ElevatedButton(
                      onPressed: data['onPressed'] as VoidCallback?,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: CustomColors.purple,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        minimumSize: const Size(double.infinity, 50),
                      ),
                      child: Text(
                        data['text'] as String,
                        style: const TextStyle(color: CustomColors.white, fontSize: 16),
                      ),
                    ),
                  ),
                )
                .toList(),
            if (_isLoading)
              const Center(child: CircularProgressIndicator()),
            if (!_isLoading && _pendingOrders.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  itemCount: _pendingOrders.length,
                  itemBuilder: (context, index) {
                    final order = _pendingOrders[index];
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
            const Spacer(),
          ],
        ),
      ),
    );
  }

  void _deleteOrder(int index) async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _pendingOrders.removeAt(index);
    });
    await prefs.setString('orders', json.encode(_pendingOrders + _completedOrders));
    _showSnackBar('Orden eliminada', Colors.red);
  }
}
