import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert'; // Para manejar la conversión JSON
import '../utils/custom_colors.dart';
import '../widgets/static_logo.dart';
import 'order_detail_screen.dart'; // Importa la pantalla de detalle de la orden

class PickingAsignadoScreen extends StatefulWidget {
  const PickingAsignadoScreen({super.key});

  @override
  _PickingAsignadoScreenState createState() => _PickingAsignadoScreenState();
}

class _PickingAsignadoScreenState extends State<PickingAsignadoScreen> {
  bool _isExpandedPending = true; // Inicialmente expandida
  bool _isExpandedCompleted = false; // Expandida finalizados

  List<Map<String, dynamic>> _pickingData = [];

  @override
  void initState() {
    super.initState();
    _loadPendingOrders(); // Carga las órdenes pendientes sincronizadas
  }

  Future<void> _loadPendingOrders() async {
    final prefs = await SharedPreferences.getInstance();
    final String? ordersJson = prefs.getString('orders');
    if (ordersJson != null) {
      setState(() {
        _pickingData = List<Map<String, dynamic>>.from(json.decode(ordersJson));
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
              'PICKING ASIGNADO',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: CustomColors.black,
              ),
            ),
            const SizedBox(height: 20),
            _buildExpandableTile('PENDIENTES', _isExpandedPending, () {
              setState(() {
                _isExpandedPending = !_isExpandedPending;
                if (_isExpandedPending) {
                  _isExpandedCompleted = false;
                }
              });
            }),
            const SizedBox(height: 10),
            _buildExpandableTile('FINALIZADOS', _isExpandedCompleted, () {
              setState(() {
                _isExpandedCompleted = !_isExpandedCompleted;
                if (_isExpandedCompleted) {
                  _isExpandedPending = false;
                }
              });
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildExpandableTile(
      String title, bool isExpanded, VoidCallback onExpansionChanged) {
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
      onExpansionChanged: (expanded) {
        // Evitar que se cierre inmediatamente después de abrir
        onExpansionChanged();
      },
      children: <Widget>[
        if (title == 'PENDIENTES' && isExpanded) _buildPickingCardList(),
        if (title == 'FINALIZADOS' && isExpanded) _buildFinalizedList(),
      ],
    );
  }

  // Función para mostrar la lista de picking
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
        return GestureDetector(
          onTap: () => _navigateToOrderDetail(data),
          child: _buildPickingCard(
            color: Colors.red, // Cambiar según prioridad si es necesario
            text: '${data['externalOrderId']}',
            pickingInfo: 'Fecha de creación: ${data['creationDate']}',
          ),
        );
      }).toList(),
    );
  }

  // Navega a la pantalla de detalles de la orden
  void _navigateToOrderDetail(Map<String, dynamic> orderData) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OrderDetailScreen(order: orderData), // Cambiado 'orderData' al parámetro 'order'
      ),
    );
  }

  // Función para mostrar la lista de finalizados (en este ejemplo, se deja vacío)
  Widget _buildFinalizedList() {
    return const Padding(
      padding: EdgeInsets.all(10.0),
      child: Text(
        'No hay órdenes finalizadas.',
        textAlign: TextAlign.center,
        style: TextStyle(fontSize: 14),
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