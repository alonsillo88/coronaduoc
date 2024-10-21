import 'package:backstore/utils/custom_colors.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart'; // Paquete para escaneo de códigos de barras
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Para guardar cambios permanentes
import 'dart:convert';

class OrderDetailScreen extends StatefulWidget {
  final Map<String, dynamic> order;
  final List<Map<String, dynamic>> pickingData;
  final List<Map<String, dynamic>> completedData;

  const OrderDetailScreen({
    Key? key,
    required this.order,
    required this.pickingData,
    required this.completedData,
  }) : super(key: key);

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('DETALLE PEDIDO'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildOrderSummary(widget.order),
            const SizedBox(height: 20),
            const Text(
              'DETALLE PEDIDO',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: ListView.builder(
                itemCount: widget.order['items'].length,
                itemBuilder: (context, index) {
                  final item = widget.order['items'][index];
                  if (item['skuName'].toString().toLowerCase() == 'flete') {
                    return const SizedBox.shrink();
                  }
                  return GestureDetector(
                    onTap: () => _showConfirmationModal(item, index),
                    child: _buildOrderItem(item, index),
                  );
                },
              ),
            ),
            ElevatedButton(
              onPressed: _saveOrderStatus,
              style: ElevatedButton.styleFrom(
                backgroundColor: CustomColors.purple,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Guardar Estado de la Orden',
                  style: TextStyle(color: CustomColors.white, fontSize: 16)),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummary(Map<String, dynamic> order) {
    final creationDate =
        DateFormat('dd-MM-yyyy').format(DateTime.parse(order['creationDate']));
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Orden: ${order['externalOrderId']}'),
            Text('Fecha de creación: $creationDate'),
            Text(
                'Cantidad de Productos: ${order['items'].where((item) => item['skuName'].toString().toLowerCase() != 'flete').length}'),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItem(Map<String, dynamic> item, int index) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Row(
          children: [
            item['imageUrl'] != null
                ? Image.network(item['imageUrl'], width: 80, height: 80)
                : Container(width: 80, height: 80, color: Colors.grey),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item['skuName'],
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text('EAN: ${item['ean']}'),
                  Text('Color: ${item['color']}'),
                  Text('Talla: ${item['size']}'),
                  Text('Cantidad: ${item['quantity']}'),
                  Text(
                      'Confirmados: ${item['quantityConfirmedBackstore'] ?? 0}'),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.camera_alt),
              onPressed: () {
                _scanBarcode(item, index);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showConfirmationModal(Map<String, dynamic> item, int index) {
    showDialog(
      context: context,
      builder: (context) {
        int confirmedQuantity = item['quantityConfirmedBackstore'] ?? 0;
        return AlertDialog(
          title: const Text('Confirmar Cantidad'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Selecciona la cantidad a confirmar:'),
              DropdownButton<int>(
                value: confirmedQuantity,
                onChanged: (value) {
                  setState(() {
                    if (value != null &&
                        value <= item['quantity'] &&
                        value >= 0) {
                      widget.order['items'][index]
                          ['quantityConfirmedBackstore'] = value;
                    }
                  });
                  Navigator.pop(context);
                },
                items: List.generate(
                  item['quantity'] + 1,
                  (index) => DropdownMenuItem(
                      value: index, child: Text(index.toString())),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              child: const Text('Cancelar'),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _scanBarcode(Map<String, dynamic> item, int index) async {
    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Escanear Código de Barras'),
          content: SizedBox(
            height: 300,
            width: 300,
            child: MobileScanner(
              onDetect: (barcodeCapture) {
                final barcode = barcodeCapture.barcodes.first;
                if (barcode.rawValue == item['ean'].toString()) {
                  setState(() {
                    int currentConfirmed =
                        item['quantityConfirmedBackstore'] ?? 0;
                    if (currentConfirmed < item['quantity']) {
                      widget.order['items'][index]
                          ['quantityConfirmedBackstore'] = currentConfirmed + 1;
                    }
                  });
                  Navigator.pop(context);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Código de barras no coincide'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
            ),
          ),
          actions: [
            TextButton(
              child: const Text('Cerrar'),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _saveOrderStatus() async {
    int totalProducts = widget.order['items']
        .where((item) => item['skuName'].toString().toLowerCase() != 'flete')
        .fold(0, (sum, item) => sum + item['quantity']);
    int totalConfirmed = widget.order['items']
        .where((item) =>
            item['skuName'].toString().toLowerCase() != 'flete' &&
            item['quantityConfirmedBackstore'] != null &&
            item['quantityConfirmedBackstore'] > 0)
        .fold(0, (sum, item) => sum + item['quantityConfirmedBackstore']);

    String orderStatus;
    if (totalConfirmed == 0) {
      orderStatus = 'Quiebre Total';
    } else if (totalConfirmed < totalProducts) {
      orderStatus = 'Quiebre Parcial';
    } else {
      orderStatus = 'Confirmada';
    }

    setState(() {
      widget.order['orderBackstoreStatus'] = orderStatus;
      widget.order['orderBackstoreStatusDate'] = DateTime.now().toIso8601String();

      // Eliminar de pickingData y agregar a completedData
      widget.pickingData.removeWhere((order) => order['externalOrderId'] == widget.order['externalOrderId']);
      widget.completedData.add(widget.order);
    });

    // Guardar cambios en SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('orders', json.encode(widget.completedData));

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Estado de la orden guardado: $orderStatus'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 1), // Mostrar durante 1 segundos
      ),
    );

    // Navegar de vuelta a la pantalla de Picking Asignado después de un pequeño retraso.
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        Navigator.pop(context);
      }
    });
  }
}
