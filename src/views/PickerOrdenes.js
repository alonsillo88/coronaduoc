import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, TextField, IconButton, Grid, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { getOrdersForPicker, updateOrderForPicking } from '../api/orderApi';
import { format } from 'date-fns';

const PickerOrdenes = ({ token, user }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrdenes = async () => {
            console.log(token);
            console.log(user.email);
            const ordenesData = await getOrdersForPicker(token, user.email);
            // Filtrar las órdenes para mostrar solo las asignadas al picker autenticado
            const filteredOrders = ordenesData.filter((orden) => orden.assignment && orden.assignment.assignedTo === user.email);
            setOrdenes(filteredOrders);
        };
        fetchOrdenes();
    }, [token, user.email]);

    const handleQuantityChange = (externalOrderId, productId, increment, maxQuantity) => {
        setOrdenes((prevOrdenes) =>
            prevOrdenes.map((orden) => {
                if (orden.externalOrderId === externalOrderId) {
                    return {
                        ...orden,
                        items: orden.items.map((item) => {
                            if (item.productId === productId) {
                                return {
                                    ...item,
                                    quantityConfirmedBackstore: Math.min(maxQuantity, Math.max(0, (item.quantityConfirmedBackstore || 0) + increment)),
                                };
                            }
                            return item;
                        }),
                    };
                }
                return orden;
            })
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

        const items = selectedOrder.items.map((item) => ({
            productId: item.productId,
            quantityBackstoreConfirmados: item.quantityConfirmedBackstore || 0,
            breakReason: item.quantityConfirmedBackstore < item.quantity ? 'Faltante' : '',
        }));

        const itemsConfirmed = selectedOrder.items.map((item) => ({        
            quantityBackstoreConfirmados: item.quantityConfirmedBackstore || 0,
            quantity : item.quantity
        }));

    
        // Corrección: Asegurar que se determine correctamente el estado de la orden
        const allItemsConfirmed = itemsConfirmed.every((item) => item.quantityBackstoreConfirmados === item.quantity);
        const allItemsZero = itemsConfirmed.every((item) => item.quantityBackstoreConfirmados === 0);

        const orderStatusBackstore = allItemsConfirmed
            ? 'Confirmada'
            : allItemsZero
            ? 'Quiebre Total'
            : 'Quiebre Parcial';

        const updateOrderInput = {
            externalOrderId: selectedOrder.externalOrderId,
            items,
            orderStatusBackstore,
        };

        try {
            const updatedOrder = await updateOrderForPicking(token, updateOrderInput);
            if (updatedOrder) {
                setOrdenes((prevOrdenes) =>
                    prevOrdenes.map((orden) => (orden.externalOrderId === updatedOrder.externalOrderId ? updatedOrder : orden))
                );
                setAlert({ type: 'success', message: 'Orden confirmada exitosamente.' });
            } else {
                setAlert({ type: 'error', message: 'Error al confirmar la orden.' });
            }
        } catch (error) {
            console.error('Error al confirmar la orden:', error);
            setAlert({ type: 'error', message: 'Error al confirmar la orden. Por favor, inténtalo nuevamente.' });
        }

        handleCloseConfirmDialog();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Órdenes para Picking</Typography>
            {alert.message && (
                <Alert severity={alert.type} onClose={() => setAlert({ type: '', message: '' })} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}
            {ordenes.length === 0 ? (
                <Typography variant="h6" color="textSecondary">No tienes órdenes asignadas en este momento.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {ordenes.map((orden) => (
                        <Grid item xs={12} md={6} key={orden.externalOrderId}>
                            <Card sx={{ backgroundColor: '#f5f5f5' }}>
                                <CardContent>
                                    <Typography variant="h6">Orden: {orden.externalOrderId}</Typography>
                                    {orden.creationDate ? (
                                        <Typography>Fecha de Compra: {format(new Date(orden.creationDate), 'dd/MM/yyyy HH:mm')}</Typography>
                                    ) : (
                                        <Typography>Fecha de Compra: N/A</Typography>
                                    )}
                                    {orden.assignment && orden.assignment.assignmentDate ? (
                                        <Typography>Fecha de Asignación: {format(new Date(orden.assignment.assignmentDate), 'dd/MM/yyyy HH:mm')}</Typography>
                                    ) : (
                                        <Typography>Fecha de Asignación: N/A</Typography>
                                    )}
                                    {orden.customer && (
                                        <Typography>Cliente: {orden.customer.firstName} {orden.customer.lastName}</Typography>
                                    )}
                                    <Typography
                                        sx={{fontWeight:800,
                                            color: orden.orderBackstoreStatus === 'Pendiente' ? 'blue' :
                                            orden.orderBackstoreStatus === null ? 'blue' :
                                                orden.orderBackstoreStatus === 'Confirmada' ? 'green' :
                                                orden.orderBackstoreStatus === 'Quiebre Parcial' ? 'orange' :
                                                orden.orderBackstoreStatus === 'Quiebre Total' ? 'red' : 'inherit'
                                        }}
                                    >
                                        Estado: {orden.orderBackstoreStatus || 'Pendiente'}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {orden.items.map((item) => (
                                            <Card key={item.productId} sx={{ mb: 2, backgroundColor: '#d1eaff' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <img src={item.imageUrl} alt={item.skuName} style={{ width: 100, height: 100, marginRight: 16 }} />
                                                        <Box>
                                                            <Typography variant="subtitle1">{item.skuName}</Typography>
                                                            <Typography>EAN: {item.ean}</Typography>
                                                            <Typography>Cantidad: {item.quantity}</Typography>
                                                            <Typography>Color: {item.color}</Typography>
                                                            <Typography>Talla: {item.size}</Typography>
                                                            <Typography>Cantidad Confirmada Backstore: {item.quantityConfirmedBackstore || 0}</Typography>
                                                        </Box>
                                                    </Box>
                                                    {(orden.orderBackstoreStatus === 'Pendiente' || orden.orderBackstoreStatus === null) && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                            <IconButton onClick={() => handleQuantityChange(orden.externalOrderId, item.productId, -1, item.quantity)}>
                                                                <Remove />
                                                            </IconButton>
                                                            <TextField
                                                                value={item.quantityConfirmedBackstore || 0}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{backgroundColor: "#FFF", width: 60, mx: 1 }}
                                                                inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                                                            />
                                                            <IconButton onClick={() => handleQuantityChange(orden.externalOrderId, item.productId, 1, item.quantity)}>
                                                                <Add />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </CardContent>
                                {orden.orderBackstoreStatus === 'Pendiente' || orden.orderBackstoreStatus === null && (
                                    <CardActions>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenConfirmDialog(orden)}>
                                            Confirmar Orden
                                        </Button>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialogo para confirmar la orden */}
            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirmar Orden</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas confirmar esta orden?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">Cancelar</Button>
                    <Button onClick={handleConfirmOrder} color="primary">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PickerOrdenes;
