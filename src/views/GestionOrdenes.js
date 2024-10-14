import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid'; // Importamos DataGrid de MUI
import { getOrdersForStore, assignOrderToPicker, getPickers } from '../api/orderApi';
import { Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from '@mui/material';

const GestionOrdenes = () => {
  const [orders, setOrders] = useState([]);
  const [pickers, setPickers] = useState([]);
  const [selectedPicker, setSelectedPicker] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga las órdenes y pickers disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getOrdersForStore();
        const fetchedPickers = await getPickers();
        setOrders(fetchedOrders);
        setPickers(fetchedPickers);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Manejo de selección de órdenes
  const handleSelectOrder = (ids) => {
    setSelectedOrders(ids); // Actualizamos el estado con las órdenes seleccionadas
  };

  // Asignación de órdenes a un picker
  const handleAssignPicker = async () => {
    if (selectedPicker && selectedOrders.length > 0) {
      try {
        await Promise.all(selectedOrders.map((orderId) => assignOrderToPicker(orderId, selectedPicker)));
        const updatedOrders = await getOrdersForStore();
        setOrders(updatedOrders);
        setSelectedOrders([]); // Limpiar la selección
        setSelectedPicker(''); // Limpiar el picker seleccionado
      } catch (error) {
        console.error('Error al asignar órdenes:', error);
      }
    }
  };

  // Columnas de la tabla con DataGrid
  const columns = [
    { field: 'id', headerName: 'Orden de Venta', width: 150 },
    { field: 'orderCorona', headerName: 'Orden Corona', width: 150 },
    { field: 'cliente', headerName: 'Cliente', width: 150 },
    { field: 'entrega', headerName: 'Entrega', width: 150 },
    { field: 'productos', headerName: 'Productos', width: 150 },
    { field: 'fechaOrden', headerName: 'Fecha Orden', width: 150 },
    { field: 'fechaPromesa', headerName: 'Fecha Promesa', width: 150 },
    { field: 'estadoOrden', headerName: 'Estado Orden', width: 150 },
    { field: 'confirmacion', headerName: 'Confirmación', width: 150 },
    { field: 'asignacion', headerName: 'Asignación', width: 150 },
    { field: 'colaborador', headerName: 'Colaborador', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <div>
          <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
            Detalle
          </Button>
          <Button variant="outlined" color="secondary" size="small">
            Cancelar
          </Button>
        </div>
      )
    }
  ];

  return (
    <Box sx={{ height: 600, width: '100%', padding: -2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Gestión de Órdenes
      </Typography>

      {/* Filtros y asignación de pickers */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel id="picker-label">Asignar Picker</InputLabel>
          <Select
            labelId="picker-label"
            id="picker-select"
            value={selectedPicker}
            onChange={(e) => setSelectedPicker(e.target.value)}
            label="Asignar Picker"
          >
            <MenuItem value="">
              <em>Selecciona un picker</em>
            </MenuItem>
            {pickers.map((picker) => (
              <MenuItem key={picker.id} value={picker.id}>
                {picker.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleAssignPicker}
          disabled={selectedOrders.length === 0 || !selectedPicker}
          sx={{ height: 55 }}
        >
          Asignar Órdenes
        </Button>
      </Box>

      {/* Tabla de órdenes */}
      {loading ? (
        <Typography variant="h6">Cargando órdenes...</Typography>
      ) : (
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          checkboxSelection
          onSelectionModelChange={handleSelectOrder}
          autoHeight
          disableSelectionOnClick
        />
      )}
    </Box>
  );
};

export default GestionOrdenes;
