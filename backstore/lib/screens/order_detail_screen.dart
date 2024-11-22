import 'package:backstore/utils/custom_colors.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class OrderDetailScreen extends StatefulWidget {
  final Map<String, dynamic> order;
  final List<Map<String, dynamic>> pickingData;
  final List<Map<String, dynamic>> completedData;

  const OrderDetailScreen({
    super.key,
    required this.order,
    required this.pickingData,
    required this.completedData,
  });

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
                ? Image.network(
                    item['imageUrl'],
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover, // Asegura que la imagen se ajuste bien
                    errorBuilder: (context, error, stackTrace) {
                      return Image.asset(
                        'assets/images/default_clothing.jpg',
                        width: 80,
                        height: 80,
                        fit: BoxFit
                            .cover, // Ajusta la imagen por defecto también
                      );
                    },
                  )
                : Image.asset(
                    'assets/images/default_clothing.jpg',
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover, // Ajusta la imagen por defecto
                  ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item['skuName'],
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text('EAN: ${item['ean']}'),
                  Text('Color: ${item['color'] ?? 'N/A'}'),
                  Text('Talla: ${item['size'] ?? 'N/A'}'),
                  Text('Cantidad: ${item['quantity']}'),
                  Text(
                      'Confirmados: ${item['quantityConfirmedBackstore'] ?? 0}'),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.camera_alt),
              onPressed: () {
                if ((item['quantityConfirmedBackstore'] ?? 0) >=
                    item['quantity']) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Text(
                          'Cantidad máxima confirmada. Modifique manualmente si desea ajustar.'),
                      backgroundColor: Colors.orange,
                      action: SnackBarAction(
                        label: 'Editar Manualmente',
                        textColor: Colors.white,
                        onPressed: () {
                          _showConfirmationModal(item, index);
                        },
                      ),
                    ),
                  );
                } else {
                  _scanBarcode(item, index);
                }
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
        int confirmedQuantityTemp = item['quantityConfirmedBackstore'] ?? 0;
        return StatefulBuilder(
          builder: (context, setStateModal) {
            return AlertDialog(
              title: const Text('Confirmar Cantidad'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Selecciona la cantidad a confirmar:'),
                  DropdownButton<int>(
                    value: confirmedQuantityTemp,
                    onChanged: (value) {
                      if (value != null) {
                        setStateModal(() {
                          confirmedQuantityTemp = value;
                        });
                      }
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
                TextButton(
                  child: const Text('Guardar'),
                  onPressed: () {
                    setState(() {
                      widget.order['items'][index]
                              ['quantityConfirmedBackstore'] =
                          confirmedQuantityTemp;
                    });
                    Navigator.pop(context);
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _scanBarcode(Map<String, dynamic> item, int index) async {
    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Escanear Producto'),
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

                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Producto escaneado correctamente'),
                          backgroundColor: Colors.green,
                        ),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Cantidad máxima ya confirmada'),
                          backgroundColor: Colors.orange,
                        ),
                      );
                    }
                  });
                  Navigator.pop(context);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Producto incorrecto. Escanea nuevamente'),
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
      widget.order['orderBackstoreStatusDate'] =
          DateTime.now().toIso8601String();

      widget.pickingData.removeWhere((order) =>
          order['externalOrderId'] == widget.order['externalOrderId']);
      widget.completedData.add(widget.order);
    });

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('orders', json.encode(widget.completedData));

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Estado de la orden guardado: $orderStatus'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 1),
      ),
    );

    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        Navigator.pop(context);
      }
    });
  }
}
