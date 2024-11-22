import 'package:backstore/utils/custom_colors.dart';
import 'package:backstore/widgets/static_logo.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert'; // Para manejar la conversión JSON
import 'package:intl/intl.dart'; // Importar para formatear la fecha
import 'order_detail_screen.dart'; // Importa la pantalla de detalle de la orden

class PickingAsignadoScreen extends StatefulWidget {
  const PickingAsignadoScreen({super.key});

  @override
  _PickingAsignadoScreenState createState() => _PickingAsignadoScreenState();
}

class _PickingAsignadoScreenState extends State<PickingAsignadoScreen> {
  bool _isExpandedPending = false;
  bool _isExpandedCompleted = false;
  bool _isExpandedQuiebres = false;

  List<Map<String, dynamic>> _pickingData = [];
  List<Map<String, dynamic>> _completedData = [];
  List<Map<String, dynamic>> _quiebresData = [];

  @override
  void initState() {
    super.initState();
    _loadOrdersData(); // Cargar todos los datos
    _loadQuiebresData(); // Cargar los datos de quiebres sincronizados
  }

  Future<void> _loadOrdersData() async {
    final prefs = await SharedPreferences.getInstance();
    final String? ordersJson = prefs.getString('orders');
    if (ordersJson != null) {
      List<Map<String, dynamic>> allOrders = List<Map<String, dynamic>>.from(json.decode(ordersJson));

      setState(() {
        _pickingData = allOrders.where((order) {
          return order['orderBackstoreStatus'] == null && order['orderBackstoreStatusDate'] == null;
        }).toList();

        _completedData = allOrders.where((order) {
          return order['orderBackstoreStatus'] != null && order['orderBackstoreStatusDate'] != null;
        }).toList();
      });
    }
  }

  Future<void> _loadQuiebresData() async {
    final prefs = await SharedPreferences.getInstance();
    final String? quiebresJson = prefs.getString('quiebres');
    if (quiebresJson != null) {
      setState(() {
        _quiebresData = List<Map<String, dynamic>>.from(json.decode(quiebresJson));
        _quiebresData = _quiebresData.map((order) {
          final int totalQuantity = order['items']
              ?.fold(0, (sum, item) => sum + (item['quantity'] ?? 0)) ?? 0;
          final int totalConfirmed = order['items']
              ?.fold(0, (sum, item) => sum + (item['quantityConfirmedBackstore'] ?? 0)) ?? 0;
          final String formattedDate = DateFormat('dd/MM/yyyy').format(DateTime.parse(order['orderBackstoreStatusDate']));

          return {
            'tipo': order['orderBackstoreStatus'] ?? 'Sin información',
            'nroOrden': order['externalOrderId'] ?? 'Sin información',
            'quiebre': formattedDate,
            'cantidad': '$totalConfirmed/$totalQuantity',
          };
        }).toList();
      });
    }
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
          icon: const Icon(Icons.account_circle,
              color: CustomColors.lightGray),
          onPressed: () {
            // Acción para el icono de perfil
          },
        ),
      ],
    ),
    body: SingleChildScrollView( // Permite desplazamiento en todo el cuerpo
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'PICKING ASIGNADO',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: CustomColors.black,
              ),
            ),
            const SizedBox(height: 20),
            _buildExpandableTile(
              title: 'PENDIENTES',
              isExpanded: _isExpandedPending,
              onExpansionChanged: (bool expanded) {
                setState(() {
                  _isExpandedPending = expanded;
                  _isExpandedCompleted = false;
                  _isExpandedQuiebres = false;
                });
              },
              content: _buildPickingCardList(),
            ),
            const SizedBox(height: 10),
            _buildExpandableTile(
              title: 'FINALIZADOS',
              isExpanded: _isExpandedCompleted,
              onExpansionChanged: (bool expanded) {
                setState(() {
                  _isExpandedCompleted = expanded;
                  _isExpandedPending = false;
                  _isExpandedQuiebres = false;
                });
              },
              content: _buildCompletedList(),
            ),
            const SizedBox(height: 10),
            _buildExpandableTile(
              title: 'QUIEBRES',
              isExpanded: _isExpandedQuiebres,
              onExpansionChanged: (bool expanded) {
                setState(() {
                  _isExpandedQuiebres = expanded;
                  _isExpandedPending = false;
                  _isExpandedCompleted = false;
                });
                if (expanded) {
                  _loadQuiebresData(); // Cargar datos de quiebres solo cuando se expanda
                }
              },
              content: _buildQuiebresTable(),
            ),
          ],
        ),
      ),
    ),
  );
}

  Widget _buildExpandableTile({
    required String title,
    required bool isExpanded,
    required Function(bool) onExpansionChanged,
    required Widget content,
  }) {
    return ExpansionTile(
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: CustomColors.black,
        ),
      ),
      trailing: const Icon(
        Icons.keyboard_arrow_down,
        color: CustomColors.purple,
      ),
      initiallyExpanded: isExpanded,
      onExpansionChanged: onExpansionChanged,
      children: <Widget>[content],
    );
  }

  Widget _buildPickingCardList() {
    if (_pickingData.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(10.0),
        child: Text(
          'No hay órdenes pendientes.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14),
        ),
      );
    }
    return Column(
      children: _pickingData.map((data) {
        String formattedCreationDate = DateFormat('dd/MM/yyyy').format(DateTime.parse(data['creationDate']));
        return GestureDetector(
          onTap: () => _navigateToOrderDetail(data),
          child: _buildPickingCard(
            color: Colors.red, // Cambiar según prioridad si es necesario
            text: '${data['externalOrderId']}',
            pickingInfo: 'Fecha de creación: $formattedCreationDate',
          ),
        );
      }).toList(),
    );
  }

  Widget _buildQuiebresTable() {
    if (_quiebresData.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(10.0),
        child: Text(
          'No hay quiebres registrados.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14),
        ),
      );
    }
    return DataTable(
      columnSpacing: 5,
      columns: const [
        DataColumn(
          label: Text(
            'Tipo',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          ),
        ),
        DataColumn(
          label: Text(
            'Nro. Orden',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          ),
        ),
        DataColumn(
          label: Text(
            'Quiebre',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          ),
        ),
        DataColumn(
          label: Text(
            'Cantidad',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          ),
        ),
      ],
      rows: _quiebresData.map((quiebre) {
        return DataRow(
          cells: [
            DataCell(Text(quiebre['tipo'] ?? 'Sin información',
                style: const TextStyle(fontSize: 14))),
            DataCell(Text(quiebre['nroOrden'] ?? 'Sin información',
                style: const TextStyle(fontSize: 14))),
            DataCell(Text(quiebre['quiebre'] ?? 'Sin información',
                style: const TextStyle(fontSize: 14))),
            DataCell(Text(quiebre['cantidad'] ?? '0/0',
                style: const TextStyle(fontSize: 14))),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildCompletedList() {
    if (_completedData.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(10.0),
        child: Text(
          'No hay órdenes finalizadas.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 14),
        ),
      );
    }
    return DataTable(
      columnSpacing: 5,
      columns: const [
        DataColumn(
          label: Text('Estado', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
        ),
        DataColumn(
          label: Text('Nro. Orden', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
        ),
        DataColumn(
          label: Text('Picking', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
        ),
        DataColumn(
          label: Text('Creado', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
        ),
      ],
      rows: _completedData.map((order) {
        String formattedCreationDate = DateFormat('dd/MM/yyyy').format(DateTime.parse(order['creationDate']));
        String formattedStatusDate = DateFormat('dd/MM/yyyy').format(DateTime.parse(order['orderBackstoreStatusDate']));
        return DataRow(
          cells: [
            DataCell(Container(
              width: 10,
              height: 10,
              color: Colors.red, // Puedes cambiar este color según el estado de la orden
            )),
            DataCell(Text(order['externalOrderId'], style: const TextStyle(fontSize: 14))),
            DataCell(Text(formattedCreationDate, style: const TextStyle(fontSize: 14))),
            DataCell(Text(formattedStatusDate, style: const TextStyle(fontSize: 14))),
          ],
        );
      }).toList(),
    );
  }

  void _navigateToOrderDetail(Map<String, dynamic> orderData) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OrderDetailScreen(
          order: orderData,
          pickingData: _pickingData,
          completedData: _completedData,
        ),
      ),
    );
  }

  Widget _buildPickingCard({
    required Color color,
    required String text,
    required String pickingInfo,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 5.0),
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        border: Border.all(color: CustomColors.black),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Container(
            width: 10,
            height: 60,
            color: color, // Color de prioridad
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  text,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  pickingInfo,
                  style: const TextStyle(fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
