import 'package:backstore/utils/custom_colors.dart';
import 'package:backstore/widgets/static_logo.dart';
import 'package:flutter/material.dart';
import 'sync_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class HistorialScreen extends StatefulWidget {
  const HistorialScreen({super.key});

  @override
  _HistorialScreenState createState() => _HistorialScreenState();
}

class _HistorialScreenState extends State<HistorialScreen> {
  final List<bool> _isSelected = [];
  bool _isSelectAll = false;
  bool _isExpandedPending = false;
  List<Map<String, dynamic>> _completedOrders = [];
  List<Map<String, dynamic>> _sentRecords = [];

  @override
  void initState() {
    super.initState();
    _loadLocalData();
  }

  Future<void> _loadLocalData() async {
    final prefs = await SharedPreferences.getInstance();
    final String? ordersJson = prefs.getString('orders');
    final String? sentRecordsJson = prefs.getString('sentRecords');

    if (ordersJson != null) {
      List<Map<String, dynamic>> allOrders = List<Map<String, dynamic>>.from(json.decode(ordersJson));
      setState(() {
        _completedOrders = allOrders.where((order) {
          return order['orderBackstoreStatus'] != null && order['orderBackstoreStatusDate'] != null;
        }).toList();
        _isSelected.addAll(List<bool>.filled(_completedOrders.length, false));
      });
    }

    if (sentRecordsJson != null) {
      setState(() {
        _sentRecords = List<Map<String, dynamic>>.from(json.decode(sentRecordsJson));
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildTitle('SINCRONIZAR', fontSize: 24),
            const SizedBox(height: 5),
            _buildTitle('Historial', fontSize: 18),
            const SizedBox(height: 30),
            _buildExpandableTile('Registros Pendientes Envío'),
            const SizedBox(height: 10),
            _buildProcessedRecordsTile('Últimos Registros Enviados/Recibidos'),
            const Spacer(),
            _buildButton('ENVIAR/RECIBIR', _sendSelectedRecords),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
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
    );
  }

  Widget _buildTitle(String text, {required double fontSize}) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: TextStyle(
        fontSize: fontSize,
        fontWeight: FontWeight.bold,
        color: CustomColors.black,
      ),
    );
  }

  Widget _buildButton(String text, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: CustomColors.purple,
        padding: const EdgeInsets.symmetric(vertical: 20),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
      child: Text(
        text,
        style: const TextStyle(color: CustomColors.white, fontSize: 16),
      ),
    );
  }

  Widget _buildExpandableTile(String title) {
    return ExpansionTile(
      onExpansionChanged: (expanded) {
        setState(() {
          _isExpandedPending = expanded;
        });
      },
      title: _buildTextTileTitle(title),
      trailing: const Icon(Icons.keyboard_arrow_down, color: CustomColors.purple),
      children: <Widget>[
        if (_isExpandedPending)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                const Text('Seleccionar todos', style: TextStyle(fontSize: 14, color: CustomColors.black)),
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
          height: 300,
          child: SingleChildScrollView(child: _buildTable()),
        ),
      ],
    );
  }

  Widget _buildProcessedRecordsTile(String title) {
    return ExpansionTile(
      title: _buildTextTileTitle(title),
      trailing: const Icon(Icons.keyboard_arrow_down, color: CustomColors.purple),
      children: <Widget>[
        const Text(
          'Fecha último envío: 18/06/2023 - 14:25 hrs',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: CustomColors.black),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 200,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: _sentRecords.length,
            itemBuilder: (context, index) {
              return Container(
                margin: const EdgeInsets.symmetric(vertical: 5.0),
                padding: const EdgeInsets.all(10.0),
                decoration: BoxDecoration(
                  border: Border.all(color: CustomColors.black),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  _sentRecords[index]['externalOrderId'],
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: CustomColors.black),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildTextTileTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: CustomColors.black),
    );
  }

  Widget _buildTable() {
    return Column(
      children: List.generate(_completedOrders.length, (index) {
        return _buildTableRow(
          color: Colors.red,
          text: _completedOrders[index]['externalOrderId'],
          pickingInfo: 'Picking: ${_completedOrders[index]['orderBackstoreStatusDate'] ?? "No especificado"}',
          isSelected: _isSelected[index],
          onChanged: (value) {
            setState(() {
              _isSelected[index] = value!;
              _checkSelectAllStatus();
            });
          },
        );
      }),
    );
  }

  Widget _buildTableRow({
    required Color color,
    required String text,
    required String pickingInfo,
    required bool isSelected,
    required ValueChanged<bool?> onChanged,
  }) {
    return GestureDetector(
      onTap: () {
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
              color: color,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    text,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 5),
                  Text(pickingInfo, style: const TextStyle(fontSize: 14)),
                ],
              ),
            ),
            Checkbox(value: isSelected, onChanged: onChanged),
          ],
        ),
      ),
    );
  }

  void _selectAll(bool selectAll) {
    setState(() {
      for (var i = 0; i < _isSelected.length; i++) {
        _isSelected[i] = selectAll;
      }
    });
  }

  void _checkSelectAllStatus() {
    _isSelectAll = _isSelected.every((selected) => selected);
  }

  Future<void> _sendSelectedRecords() async {
    final selectedOrders = <Map<String, dynamic>>[];
    for (var i = 0; i < _isSelected.length; i++) {
      if (_isSelected[i]) {
        selectedOrders.add(_completedOrders[i]);
      }
    }

    if (selectedOrders.isNotEmpty) {
      setState(() {
        _completedOrders.removeWhere((order) => selectedOrders.contains(order));
        _isSelected.clear();
        _isSelected.addAll(List<bool>.filled(_completedOrders.length, false));
        for (var order in selectedOrders) {
          if (!_sentRecords.any((sentOrder) => sentOrder['externalOrderId'] == order['externalOrderId'])) {
            _sentRecords.add(order);
          }
        }
      });

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('completedOrders', json.encode(_completedOrders));
      await prefs.setString('sentRecords', json.encode(_sentRecords));

      _showSuccessDialog(context);
    } else {
      _showSnackBar(context, 'Por favor, seleccione al menos un elemento.');
    }
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), duration: const Duration(seconds: 2)),
    );
  }

  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Se ha sincronizado correctamente la aplicación...',
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              const SizedBox(height: 20),
              _buildButton('Aceptar', () {
                Navigator.of(context).pop();
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const SyncScreen()));
              }),
            ],
          ),
        );
      },
    );
  }
}