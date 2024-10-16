import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getOrdersForStore, assignOrderToPicker, getPickersBySucursal } from '../api/orderApi';
import { Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllSucursales } from '../api/sucursalApi';
import { getSucursal } from '../api/sucursalApi';

const GestionOrdenes = () => {
    const [orders, setOrders] = useState([]);
    const [pickers, setPickers] = useState([]);
    const [selectedPicker, setSelectedPicker] = useState('');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTienda, setSelectedTienda] = useState('');
    const [sucursales, setSucursales] = useState([]);
    const [sucursalAsignada, setSucursalAsignada] = useState(null);
    const [user, setUser] = useState(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const savedUser = {
            firstName: localStorage.getItem('nombreUsuario'),
            lastName: localStorage.getItem('apellidoUsuario'),
            email: localStorage.getItem('emailUsuario'),
            roles: JSON.parse(localStorage.getItem('rolesUsuario')),
            idSucursal: localStorage.getItem('idSucursal'),
            token: localStorage.getItem('token')
        };

        if (savedUser && savedUser.roles && savedUser.roles.length > 0) {
            setUser(savedUser);

            if (savedUser.roles.includes('Administrador Global')) {
                // Cargar todas las sucursales si es Administrador Global
                getAllSucursales(savedUser.token)
                    .then((data) => {
                        setSucursales(data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error al obtener sucursales:', error);
                        setLoading(false);
                    });
            } else {
                // Cargar la sucursal asignada si no es Administrador Global
                getSucursal(savedUser.token, savedUser.idSucursal)
                    .then((data) => {
                        setSucursalAsignada(data.nombreSucursal);
                        setSelectedTienda(data.idTienda); // Selecciona la tienda automáticamente
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error al obtener la sucursal asignada:', error);
                        setLoading(false);
                    });
            }
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedOrders = await getOrdersForStore(user.token, selectedTienda);
                const fetchedPickers = await getPickersBySucursal(user.token, selectedTienda);

                setOrders(fetchedOrders);
                setPickers(fetchedPickers);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && selectedTienda) {
            fetchData();
        }
    }, [user, selectedTienda]);

    const handleSelectOrder = (ids) => {
        setSelectedOrders(ids);
    };

    const handleAssignPicker = async () => {
        if (selectedPicker && selectedOrders.length > 0) {
            try {
                await Promise.all(selectedOrders.map((orderId) => assignOrderToPicker(orderId, selectedPicker, user.token)));
                const updatedOrders = await getOrdersForStore(user.token);
                setOrders(updatedOrders);
                setSelectedOrders([]);
                setSelectedPicker('');
            } catch (error) {
                console.error('Error al asignar órdenes:', error);
            }
        }
    };

    const handleTiendaChange = (e) => {
        const selectedId = e.target.value;
        setSelectedTienda(selectedId);
        const nuevaSucursal = sucursales.find((sucursal) => sucursal.idTienda === selectedId);
        setSucursalAsignada(nuevaSucursal);
    };

    return (
        <div>
      
            <Box sx={{ height: 600, width: '100%', padding: 2 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Gestión de Órdenes
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
                    <FormControl variant="outlined" sx={{ minWidth: 200, mb: isMobile ? 2 : 0 }}>
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
                                <MenuItem key={picker.email} value={picker.email}>
                                    {picker.firstName} {picker.lastName}
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

                {loading ? (
                    <Typography variant="h6">Cargando órdenes...</Typography>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <DataGrid
                            rows={orders}
                            columns={[
                                { field: 'id', headerName: 'Orden de Venta', width: isMobile ? 120 : 150 },
                                { field: 'orderCorona', headerName: 'Orden Corona', width: isMobile ? 120 : 150 },
                                { field: 'cliente', headerName: 'Cliente', width: isMobile ? 120 : 150 },
                                { field: 'entrega', headerName: 'Entrega', width: isMobile ? 120 : 150 },
                                { field: 'productos', headerName: 'Productos', width: isMobile ? 120 : 150 },
                                { field: 'fechaOrden', headerName: 'Fecha Orden', width: isMobile ? 120 : 150 },
                                { field: 'fechaPromesa', headerName: 'Fecha Promesa', width: isMobile ? 120 : 150 },
                                { field: 'estadoOrden', headerName: 'Estado Orden', width: isMobile ? 120 : 150 },
                                { field: 'confirmacion', headerName: 'Confirmación', width: isMobile ? 120 : 150 },
                                { field: 'asignacion', headerName: 'Asignación', width: isMobile ? 120 : 150 },
                                { field: 'colaborador', headerName: 'Colaborador', width: isMobile ? 120 : 150 },
                                {
                                    field: 'acciones',
                                    headerName: 'Acciones',
                                    width: isMobile ? 100 : 150,
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
                            ]}
                            pageSize={10}
                            checkboxSelection
                            onSelectionModelChange={handleSelectOrder}
                            autoHeight
                            disableSelectionOnClick
                            sx={{
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'var(--color-purple-dark)',
                                    color: 'white'
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default GestionOrdenes;
