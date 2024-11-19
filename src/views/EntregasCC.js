import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Backdrop, Alert, Paper, Grid, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getCCOrders, updateCCOrderStatus } from '../api/orderApi'; // Importar funciones de orderApi

const EntregasCC = ({ token, user }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrdenes, setFilteredOrdenes] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        const fetchOrdenesCC = async () => {
            setLoading(true);
            try {
                const ordenesData = await getCCOrders(token, user.idSucursal);
                setOrdenes(ordenesData);
                setFilteredOrdenes(ordenesData);
            } catch (error) {
                console.error('Error al obtener las órdenes C&C:', error);
                setAlert({ type: 'error', message: 'Error al obtener las órdenes C&C.' });
            } finally {
                setLoading(false);
            }
        };
        fetchOrdenesCC();
    }, [token, user.idSucursal]);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredOrdenes(
            ordenes.filter((orden) =>
                orden.externalOrderId.toLowerCase().includes(term) ||
                orden.customer.firstName.toLowerCase().includes(term) ||
                orden.customer.lastName.toLowerCase().includes(term) ||
                orden.customer.document.toLowerCase().includes(term) ||
                (orden.customer.documentVerifyDigit && orden.customer.documentVerifyDigit.toLowerCase().includes(term)) ||
                orden.customer.email.toLowerCase().includes(term) ||
                orden.customer.phone.toLowerCase().includes(term)
            )
        );
    };

    const handleOpenConfirmDialog = (orden) => {
        setSelectedOrder(orden);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setSelectedOrder(null);
    };

    const handleConfirmOrder = async () => {
        if (!selectedOrder) return;

        const updateCCOrderInput = {
            externalOrderId: selectedOrder.externalOrderId,
            newStatus: 'Retirada',
            comments: 'El cliente retiró la orden exitosamente',
        };

        setLoading(true);
        try {
            const updatedOrder = await updateCCOrderStatus(token, updateCCOrderInput);
            if (updatedOrder) {
                setOrdenes((prevOrdenes) =>
                    prevOrdenes.map((orden) => (orden.externalOrderId === updatedOrder.externalOrderId ? updatedOrder : orden))
                );
                setFilteredOrdenes((prevOrdenes) =>
                    prevOrdenes.map((orden) => (orden.externalOrderId === updatedOrder.externalOrderId ? updatedOrder : orden))
                );
                setAlert({ type: 'success', message: 'Orden marcada como retirada exitosamente.' });
            } else {
                setAlert({ type: 'error', message: 'Error al confirmar la orden.' });
            }
        } catch (error) {
            console.error('Error al confirmar la orden:', error);
            setAlert({ type: 'error', message: 'Error al confirmar la orden. Por favor, inténtalo nuevamente.' });
        } finally {
            setLoading(false);
            handleCloseConfirmDialog();
        }
    };

    if (loading) {
        return (
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    const columns = [
        { field: 'externalOrderId', headerName: 'ID de Orden', width: 200 },
        { field: 'customerName', headerName: 'Cliente', width: 200 },
        { field: 'document', headerName: 'RUT', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Teléfono', width: 150 },
        { field: 'orderBackstoreStatus', headerName: 'Estado', width: 150, 
          renderCell: (params) => (
            <Typography
                sx={{
                    fontWeight: 800,
                    color: params.value === 'Pendiente' ? 'blue' :
                        params.value === 'Retirada' ? 'green' : 'inherit'
                }}
            >
                {params.value}
            </Typography>
          )
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 250,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleOpenConfirmDialog(params.row)}
                    sx={{ fontWeight: 'bold' }}
                >
                    Marcar como Retirada
                </Button>
            ),
        },
    ];

    const rows = filteredOrdenes.map((orden) => ({
        id: orden.externalOrderId,
        externalOrderId: orden.externalOrderId,
        customerName: `${orden.customer.firstName} ${orden.customer.lastName}`,
        document: `${orden.customer.document}-${orden.customer.documentVerifyDigit}`,
        email: orden.customer.email,
        phone: orden.customer.phone,
        orderBackstoreStatus: orden.orderBackstoreStatus || 'Pendiente',
    }));

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)' }}>
                Entregas C&C
            </Typography>
            {alert.message && (
                <Alert severity={alert.type} onClose={() => setAlert({ type: '', message: '' })} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                    label="Buscar por Cliente, RUT, Email o Teléfono"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: '70%' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: '56px', fontWeight: 'bold' }}
                >
                    Actualizar
                </Button>
            </Box>
            <Paper elevation={6} sx={{ height: 600, width: '100%', p: 2 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'var(--color-purple-dark)',
                            color: '#fff',
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'rgba(98, 0, 234, 0.1)'
                        },
                        '& .MuiDataGrid-cell': {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }
                    }}
                />
            </Paper>

            {/* Diálogo de Confirmación */}
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirmar Entrega</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas marcar esta orden como retirada?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="error" sx={{ fontWeight: 'bold' }}>Cancelar</Button>
                    <Button onClick={handleConfirmOrder} color="primary" sx={{ fontWeight: 'bold' }}>Confirmar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EntregasCC;
