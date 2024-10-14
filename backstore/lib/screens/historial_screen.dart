import 'package:flutter/material.dart';
import '../utils/custom_colors.dart';
import '../widgets/static_logo.dart'; // Usar el logo estático reutilizable
import 'sync_screen.dart';  // Importar la pantalla de sincronización

class HistorialScreen extends StatefulWidget {
  const HistorialScreen({super.key});

  @override
  _HistorialScreenState createState() => _HistorialScreenState();
}

class _HistorialScreenState extends State<HistorialScreen> {
  // Lista para manejar los estados de los checkboxes
  final List<bool> _isSelected = [false, false, false, false, false, false];
  bool _isSelectAll = false; // Estado del checkbox "Seleccionar todos"
  bool _isExpandedPending = false;  // Controla si la pestaña de registros pendientes está expandida

  // Lista de registros procesados (últimos enviados/recibidos)
  final List<String> _processedRecords = List.generate(15, (index) => '1342743713749-01 (3713749)');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: CustomColors.background,  // Fondo blanco
        elevation: 0,  // Sin sombra en el AppBar
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: CustomColors.black),  // Icono de retroceso negro
          onPressed: () {
            Navigator.pop(context);  // Volver a la pantalla anterior
          },
        ),
        title: const Center(
          child: StaticCoronaLogo(
            size: 125,  // Ajustamos el tamaño del logo
            color: CustomColors.black,  // Color negro del logo
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle, color: CustomColors.lightGray),  // Icono de perfil
            onPressed: () {
              // Acción al presionar el icono de perfil
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
                color: CustomColors.black,  // Texto en negro
              ),
            ),
            const SizedBox(height: 5),
            const Text(
              'Historial',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: CustomColors.black,  // Texto en negro
              ),
            ),
            const SizedBox(height: 30),
            _buildExpandableTile('Registros Pendientes Envío'),
            const SizedBox(height: 10),
            _buildProcessedRecordsTile('Últimos Registros Enviados/Recibidos'),
            const Spacer(),
            _buildButton('ENVIAR/RECIBIR', () {
              if (_isSelected.any((selected) => selected)) {
                _showSuccessDialog(context);  // Mostrar el diálogo de éxito
              } else {
                _showSnackBar(context, 'Por favor, seleccione al menos un elemento.');
              }
            }),
            const SizedBox(height: 20),  // Espacio en la parte inferior
          ],
        ),
      ),
    );
  }

  // Función que construye los botones
  Widget _buildButton(String text, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: CustomColors.purple,
        padding: const EdgeInsets.symmetric(vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),  // Bordes redondeados
        ),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: CustomColors.white,  // Texto blanco
          fontSize: 16,
        ),
      ),
    );
  }

  // Función que construye las tiles expandibles para los registros pendientes
  Widget _buildExpandableTile(String title) {
    return ExpansionTile(
      onExpansionChanged: (expanded) {
        setState(() {
          _isExpandedPending = expanded;
        });
      },
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
        color: CustomColors.purple,  // Flecha morada
      ),
      children: <Widget>[
        if (_isExpandedPending)  // Solo mostramos el botón de "Seleccionar todos" cuando la pestaña está expandida
          Padding(
            padding: const EdgeInsets.only(left: 10.0, right: 10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                const Text(
                  'Seleccionar todos',
                  style: TextStyle(fontSize: 14, color: CustomColors.black),
                ),
                Checkbox(
                  value: _isSelectAll,
                  onChanged: (value) {
                    setState(() {
                      _isSelectAll = value!;
                      _selectAll(_isSelectAll);
                    });
                  },
                ),
              ],
            ),
          ),
        SizedBox(
          height: 300,  // Altura ajustada para que se vean los primeros 3 registros completos
          child: SingleChildScrollView(
            child: _buildTable(),  // La tabla que contiene los registros
          ),
        ),
      ],
    );
  }

  // Función que construye las tiles expandibles para los registros procesados
  Widget _buildProcessedRecordsTile(String title) {
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
        color: CustomColors.purple,  // Flecha morada
      ),
      children: <Widget>[
        const Text(
          'Fecha último envío: 18/06/2023 - 14:25 hrs',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: CustomColors.black,
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 200,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: _processedRecords.length,
            itemBuilder: (context, index) {
              return Container(
                margin: const EdgeInsets.symmetric(vertical: 5.0),
                padding: const EdgeInsets.all(10.0),
                decoration: BoxDecoration(
                  border: Border.all(color: CustomColors.black),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  _processedRecords[index],
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: CustomColors.black,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // Función para construir la tabla de registros pendientes
  Widget _buildTable() {
    return Column(
      children: [
        _buildTableRow(
          color: Colors.green,
          text: '1342743713749-01 (3713749)',
          pickingInfo: 'Picking: 18/06/2023 - 14:25 hrs\nFecha entrega/retiro: 20/06/2023',
          isSelected: _isSelected[0],
          onChanged: (value) {
            setState(() {
              _isSelected[0] = value!;
              _checkSelectAllStatus();
            });
          },
        ),
        _buildTableRow(
          color: Colors.yellow,
          text: '1342743713749-02 (3713750)',
          pickingInfo: 'Picking: 17/06/2023 - 10:15 hrs\nFecha entrega/retiro: 19/06/2023',
          isSelected: _isSelected[1],
          onChanged: (value) {
            setState(() {
              _isSelected[1] = value!;
              _checkSelectAllStatus();
            });
          },
        ),
        _buildTableRow(
          color: Colors.red,
          text: '1342743713749-03 (3713751)',
          pickingInfo: 'Picking: 16/06/2023 - 08:00 hrs\nFecha entrega/retiro: 18/06/2023',
          isSelected: _isSelected[2],
          onChanged: (value) {
            setState(() {
              _isSelected[2] = value!;
              _checkSelectAllStatus();
            });
          },
        ),
      ],
    );
  }

  // Función que construye cada fila de la tabla
  Widget _buildTableRow({
    required Color color,
    required String text,
    required String pickingInfo,
    required bool isSelected,
    required ValueChanged<bool?> onChanged,
  }) {
    return GestureDetector(
      onTap: () {
        // Cambia el estado al tocar la card completa
        setState(() {
          onChanged(!isSelected);
        });
      },
      child: Container(
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
              color: color,  // El color verde, amarillo o rojo basado en la antigüedad
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
            Checkbox(
              value: isSelected,
              onChanged: onChanged,
            ),
          ],
        ),
      ),
    );
  }

  // Función para manejar "Seleccionar todos"
  void _selectAll(bool selectAll) {
    for (var i = 0; i < _isSelected.length; i++) {
      _isSelected[i] = selectAll;
    }
  }

  // Función para actualizar el estado de "Seleccionar todos"
  void _checkSelectAllStatus() {
    setState(() {
      _isSelectAll = _isSelected.every((selected) => selected);
    });
  }

  // Función para mostrar el SnackBar en caso de que no haya elementos seleccionados
  void _showSnackBar(BuildContext context, String message) {
    final snackBar = SnackBar(
      content: Text(message),
      duration: const Duration(seconds: 2),  // Duración del mensaje
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  // Función para mostrar el diálogo de éxito
  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Se ha sincronizado correctamente la aplicación...',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,  // Tamaño de fuente más grande
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => const SyncScreen()),
                  );  // Redirigir a la pantalla de sincronización
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: CustomColors.purple,  // Botón morado
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text(
                  'Aceptar',
                  style: TextStyle(
                    color: Colors.white,  // Texto blanco
                    fontSize: 16,  // Tamaño de texto
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}