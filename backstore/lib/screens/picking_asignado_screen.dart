import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../widgets/static_logo.dart'; // Usar el logo estático reutilizable

class PickingAsignadoScreen extends StatefulWidget {
  const PickingAsignadoScreen({super.key});

  @override
  _PickingAsignadoScreenState createState() => _PickingAsignadoScreenState();
}

class _PickingAsignadoScreenState extends State<PickingAsignadoScreen> {
  bool _isExpandedPending = true; // Inicialmente expandida
  bool _isExpandedInProgress = false;
  bool _isExpandedCompleted = false;
  bool _isExpandedBreaks = false; // Nueva expansión para "Quiebres"

  final List<Map<String, dynamic>> _pickingData = [
    {
      'priority': 'high',
      'code': '1342743713749-01',
      'id': '3713749',
      'status': 'C&C',
      'date': '20/06/2023',
      'products': 2,
      'color': Colors.red
    },
    {
      'priority': 'medium',
      'code': '1342743713749-02',
      'id': '3713750',
      'status': 'SFS',
      'date': '20/06/2023',
      'products': 2,
      'color': Colors.yellow
    },
    {
      'priority': 'low',
      'code': '1342743713749-03',
      'id': '3713751',
      'status': 'C&C',
      'date': '20/06/2023',
      'products': 2,
      'color': Colors.green
    },
    // Agregar más datos aquí
  ];

  final List<Map<String, dynamic>> _quiebresData = [
    {
      'tipo': 'Total',
      'nroOrden': '1342743713749-01',
      'fecha': '10/06/23',
      'cantidad': '3/3'
    },
    {
      'tipo': 'Total',
      'nroOrden': '1342743713749-02',
      'fecha': '10/06/23',
      'cantidad': '2/2'
    },
    {
      'tipo': 'Parcial',
      'nroOrden': '1342743713749-03',
      'fecha': '10/06/23',
      'cantidad': '1/3'
    },
    {
      'tipo': 'Total',
      'nroOrden': '1342743713749-04',
      'fecha': '10/06/23',
      'cantidad': '1/1'
    },
    {
      'tipo': 'Parcial',
      'nroOrden': '1342743713749-05',
      'fecha': '10/06/23',
      'cantidad': '1/3'
    },
    {
      'tipo': 'Parcial',
      'nroOrden': '1342743713749-06',
      'fecha': '10/06/23',
      'cantidad': '1/3'
    },
  ];

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
            icon:
                const Icon(Icons.account_circle, color: CustomColors.lightGray),
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
                  _isExpandedInProgress = false;
                  _isExpandedCompleted = false;
                  _isExpandedBreaks = false;
                }
              });
            }),
            const SizedBox(height: 10),
            _buildExpandableTile('EN CURSO', _isExpandedInProgress, () {
              setState(() {
                _isExpandedInProgress = !_isExpandedInProgress;
                if (_isExpandedInProgress) {
                  _isExpandedPending = false;
                  _isExpandedCompleted = false;
                  _isExpandedBreaks = false;
                }
              });
            }),
            const SizedBox(height: 10),
            _buildExpandableTile('FINALIZADOS', _isExpandedCompleted, () {
              setState(() {
                _isExpandedCompleted = !_isExpandedCompleted;
                if (_isExpandedCompleted) {
                  _isExpandedPending = false;
                  _isExpandedInProgress = false;
                  _isExpandedBreaks = false;
                }
              });
            }),
            const SizedBox(height: 10),
            _buildExpandableTile('QUIEBRES', _isExpandedBreaks, () {
              setState(() {
                _isExpandedBreaks = !_isExpandedBreaks;
                if (_isExpandedBreaks) {
                  _isExpandedPending = false;
                  _isExpandedInProgress = false;
                  _isExpandedCompleted = false;
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
        if (title == 'QUIEBRES' && isExpanded) _buildBreaksTable(),
        if (isExpanded && title != 'QUIEBRES') _buildPickingCardList(),
      ],
    );
  }

  // Función para mostrar la lista de picking
  Widget _buildPickingCardList() {
    return Column(
      children: _pickingData.map((data) {
        return _buildPickingCard(
          color: data['color'],
          text: '${data['code']} (${data['id']}) ${data['status']}',
          pickingInfo:
              'Fecha entrega/retiro: ${data['date']}\nCant. Productos: ${data['products']}',
        );
      }).toList(),
    );
  }

  // Función para mostrar la tabla de quiebres sin scroll horizontal
  Widget _buildBreaksTable() {
    return Column(
      children: [
        // Encabezados de la tabla, fuera del scroll
        const Row(
          children: [
            Expanded(
                flex: 2,
                child: Text('Tipo',
                    style: TextStyle(fontWeight: FontWeight.bold))),
            Expanded(
                flex: 4,
                child: Text('Nro. Orden',
                    style: TextStyle(fontWeight: FontWeight.bold))),
            Expanded(
                flex: 2,
                child: Text('Fecha',
                    style: TextStyle(fontWeight: FontWeight.bold))),
            Expanded(
                flex: 2,
                child: Text('Cantidad',
                    style: TextStyle(fontWeight: FontWeight.bold))),
          ],
        ),
        const SizedBox(height: 10), // Espacio entre encabezado y datos
        // Datos con scroll vertical
        SizedBox(
          height: 200, // Ajustamos la altura de la tabla
          child: SingleChildScrollView(
            child: Column(
              children: _quiebresData.map((data) {
                return Row(
                  children: [
                    Expanded(flex: 2, child: Text(data['tipo'])),
                    Expanded(flex: 4, child: Text(data['nroOrden'])),
                    Expanded(flex: 2, child: Text(data['fecha'])),
                    Expanded(
                      flex: 2,
                      child: Text(
                        data['cantidad'],
                        textAlign: TextAlign.center, // Centra el texto
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        ),
      ],
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