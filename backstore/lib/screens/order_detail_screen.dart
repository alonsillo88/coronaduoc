import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart'; // Paquete para escaneo de códigos de barras

class OrderDetailScreen extends StatefulWidget {
  final Map<String, dynamic> order;

  const OrderDetailScreen({Key? key, required this.order}) : super(key: key);

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
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummary(Map<String, dynamic> order) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Orden: ${order['externalOrderId']}'),
            Text('Fecha de creación: ${order['creationDate']}'),
            Text('Cantidad de Productos: ${order['items'].where((item) => item['skuName'].toString().toLowerCase() != 'flete').length}'),
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
                  Text(item['skuName'], style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text('EAN: ${item['ean']}'),
                  Text('Color: ${item['color']}'),
                  Text('Talla: ${item['size']}'),
                  Text('Cantidad: ${item['quantity']}'),
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
                    if (value != null && value <= item['quantity'] && value >= 0) {
                      widget.order['items'][index]['quantityConfirmedBackstore'] = value;
                    }
                  });
                  Navigator.pop(context);
                },
                items: List.generate(
                  item['quantity'] + 1,
                  (index) => DropdownMenuItem(value: index, child: Text(index.toString())),
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
                    int currentConfirmed = item['quantityConfirmedBackstore'] ?? 0;
                    if (currentConfirmed < item['quantity']) {
                      widget.order['items'][index]['quantityConfirmedBackstore'] = currentConfirmed + 1;
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
}