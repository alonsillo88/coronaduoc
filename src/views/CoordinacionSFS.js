import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, CircularProgress, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import { getTransportOrders, updateTransportOrderStatus } from '../api/orderApi';
import '../index.css'; // Import custom styles

const CoordinacionSFS = ({ token, user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const ordersData = await getTransportOrders(token);
                setOrders(ordersData);
            } catch (error) {
                console.error('Error al obtener las órdenes de transporte:', error);
                setAlert({ type: 'error', message: 'Error al obtener las órdenes de transporte.' });
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const handleOpenDialog = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;
        setLoading(true);
        try {
            await updateTransportOrderStatus(token, selectedOrder.id, newStatus);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === selectedOrder.id ? { ...order, status: newStatus } : order
                )
            );
            setAlert({ type: 'success', message: 'Estado de la orden actualizado correctamente.' });
        } catch (error) {
            console.error('Error al actualizar el estado de la orden:', error);
            setAlert({ type: 'error', message: 'Error al actualizar el estado de la orden.' });
        } finally {
            setLoading(false);
            handleCloseDialog();
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress color="inherit" />
                </Box>
            )}
            {alert.message && (
                <Alert severity={alert.type} onClose={() => setAlert({ type: '', message: '' })} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}
            <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-purple-dark)', fontWeight: 'bold' }}>
                Coordinación SFS - Órdenes de Transporte
            </Typography>
            {!loading && orders.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No hay órdenes de transporte en este momento.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {orders.map((order) => (
                        <Grid item xs={12} md={6} key={order.id}>
                            <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'var(--color-bg-white)', borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)' }}>
                                    Orden ID: {order.id}
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="Cliente" secondary={`${order.customer.firstName} ${order.customer.lastName}`} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Dirección de Envío" secondary={order.shippingAddress} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Estado Actual" secondary={order.status} />
                                    </ListItem>
                                </List>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenDialog(order)}
                                    sx={{ mt: 2 }}
                                >
                                    Actualizar Estado
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialogo para actualizar estado de la orden */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Actualizar Estado de la Orden</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nuevo Estado"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdateStatus} color="primary">
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CoordinacionSFS;
