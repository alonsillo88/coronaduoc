import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, TextField, IconButton, Grid, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, Backdrop, CircularProgress, Pagination } from '@mui/material';
import { Add, Remove, NavigateBefore, NavigateNext, ArrowBack, ArrowForward } from '@mui/icons-material';
import { getOrdersForPicker, updateOrderForPicking } from '../api/orderApi';
import { format } from 'date-fns';
import '../index.css'; // Import custom styles

const PickerOrdenes = ({ token, user }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openResultDialog, setOpenResultDialog] = useState(false);
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        const fetchOrdenes = async () => {
            setLoading(true);
            try {
                const ordenesData = await getOrdersForPicker(token, user.email);
                // Filtrar las órdenes para mostrar solo las asignadas al picker autenticado
                const filteredOrders = ordenesData.filter((orden) => orden.assignment && orden.assignment.assignedTo === user.email);
                setOrdenes(filteredOrders);
            } catch (error) {
                setAlert({ type: 'error', message: 'Error al obtener las órdenes.' });
            } finally {
                setLoading(false);
            }
        };
        fetchOrdenes();
    }, [token, user.email]);

    const handleQuantityChange = (externalOrderId, ean, increment, maxQuantity) => {
        setOrdenes((prevOrdenes) =>
            prevOrdenes.map((orden) => {
                if (orden.externalOrderId === externalOrderId) {
                    return {
                        ...orden,
                        items: orden.items.map((item) => {
                            if (item.ean === ean) {
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
            ean: item.ean,
            quantityBackstoreConfirmados: item.quantityConfirmedBackstore || 0,
            breakReason: item.quantityConfirmedBackstore < item.quantity ? 'Faltante' : '',
        }));

        const itemsConfirmed = selectedOrder.items.map((item) => ({
            quantityBackstoreConfirmados: item.quantityConfirmedBackstore || 0,
            quantity: item.quantity,
        }));

        // Determinar el estado de la orden basado en las cantidades confirmadas
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

        setLoading(true);
        try {
            const updatedOrder = await updateOrderForPicking(token, updateOrderInput);
            if (updatedOrder) {
                setOrdenes((prevOrdenes) =>
                    prevOrdenes.map((orden) => (orden.externalOrderId === updatedOrder.externalOrderId ? updatedOrder : orden))
                );
                setResultMessage(`Orden ${selectedOrder.externalOrderId} confirmada exitosamente.`);
            } else {
                setResultMessage(`Error al confirmar la orden ${selectedOrder.externalOrderId}.`);
            }
        } catch (error) {
            console.error('Error al confirmar la orden:', error);
            setResultMessage(`Error al confirmar la orden ${selectedOrder.externalOrderId}. Por favor, inténtalo nuevamente.`);
        } finally {
            setLoading(false);
            handleCloseConfirmDialog();
            setOpenResultDialog(true);
        }
    };

    const handleCloseResultDialog = () => {
        setOpenResultDialog(false);
        setResultMessage('');
    };

    const currentOrder = ordenes[currentOrderIndex] || null;

    return (
        <Box sx={{ p: 3 }}>
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-purple-dark)', fontWeight: 'bold' }}>Órdenes para Picking</Typography>
            {ordenes.length === 0 ? (
                <Typography variant="h6" color="textSecondary">No tienes órdenes asignadas en este momento.</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 600, mb: 2 }}>
                        <Tooltip title="Orden anterior">
                            <IconButton disabled={currentOrderIndex === 0} onClick={() => setCurrentOrderIndex((prev) => prev - 1)}>
                                <ArrowBack />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Siguiente orden">
                            <IconButton disabled={currentOrderIndex === ordenes.length - 1} onClick={() => setCurrentOrderIndex((prev) => prev + 1)}>
                                <ArrowForward />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {currentOrder && (
                        <Card sx={{ width: '100%', maxWidth: 600, backgroundColor: 'var(--color-bg-white)', boxShadow: 3, borderRadius: 4, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.02)' } }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ color: 'var(--color-purple-dark)', fontWeight: 'bold' }}>Orden: {currentOrder.externalOrderId}</Typography>
                                {currentOrder.creationDate ? (
                                    <Typography>Fecha de Compra: {format(new Date(currentOrder.creationDate), 'dd/MM/yyyy HH:mm')}</Typography>
                                ) : (
                                    <Typography>Fecha de Compra: N/A</Typography>
                                )}
                                {currentOrder.assignment && currentOrder.assignment.assignmentDate ? (
                                    <Typography>Fecha de Asignación: {format(new Date(currentOrder.assignment.assignmentDate), 'dd/MM/yyyy HH:mm')}</Typography>
                                ) : (
                                    <Typography>Fecha de Asignación: N/A</Typography>
                                )}
                                {currentOrder.customer && (
                                    <Typography>Cliente: {currentOrder.customer.firstName} {currentOrder.customer.lastName}</Typography>
                                )}
                                <Typography
                                    sx={{ fontWeight: 800, mt: 2, color: currentOrder.orderBackstoreStatus === 'Pendiente' ? 'blue' :
                                        currentOrder.orderBackstoreStatus === 'Confirmada' ? 'green' :
                                        currentOrder.orderBackstoreStatus === 'Quiebre Parcial' ? 'orange' :
                                        currentOrder.orderBackstoreStatus === 'Quiebre Total' ? 'red' : 'inherit'
                                    }}
                                >
                                    Estado: {currentOrder.orderBackstoreStatus || 'Pendiente'}
                                </Typography>
                                <Box sx={{ mt: 3 }}>
                                    {currentOrder.items.map((item) => (
                                        <Card key={item.ean} sx={{ mb: 1, backgroundColor: '#f0f4ff', borderRadius: 2, p: 1 }}> {/* Compactando el tamaño de cada producto */}
                                            <CardContent sx={{ padding: '8px !important' }}> {/* Reduciendo el padding interno */}
                                                <Grid container spacing={1} alignItems="center"> {/* Reduciendo el espacio entre elementos */}
                                                    <Grid item xs={2}>
                                                        <img src={item.imageUrl} alt={item.skuName} style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
                                                    </Grid>
                                                    <Grid item xs={10}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{item.skuName}</Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}> {/* Compactando datos en una sola línea */}
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)' }}>EAN:</Typography>
                                                            <Typography>{item.ean}</Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)' }}>Cantidad:</Typography>
                                                            <Typography>{item.quantity}</Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)' }}>Color:</Typography>
                                                            <Typography>{item.color}</Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)' }}>Talla:</Typography>
                                                            <Typography>{item.size}</Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)' }}>Confirmado:</Typography>
                                                            <Typography>{item.quantityConfirmedBackstore || 0}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                {(currentOrder.orderBackstoreStatus === 'Pendiente' || currentOrder.orderBackstoreStatus === null) && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}> {/* Compactando botones de cantidad */}
                                                        <Tooltip title="Disminuir cantidad">
                                                            <IconButton size="small" onClick={() => handleQuantityChange(currentOrder.externalOrderId, item.ean, -1, item.quantity)}>
                                                                <Remove />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <TextField
                                                            value={item.quantityConfirmedBackstore || 0}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ backgroundColor: "#FFF", width: 40, mx: 1 }}
                                                            inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                                                        />
                                                        <Tooltip title="Aumentar cantidad">
                                                            <IconButton size="small" onClick={() => handleQuantityChange(currentOrder.externalOrderId, item.ean, 1, item.quantity)}>
                                                                <Add />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </CardContent>
                            {(currentOrder.orderBackstoreStatus === 'Pendiente' || currentOrder.orderBackstoreStatus === null) && (
                                <CardActions>
                                    <Button variant="contained" color="primary" onClick={() => handleOpenConfirmDialog(currentOrder)}>
                                        Confirmar Orden
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    )}
                    <Pagination
                        count={ordenes.length}
                        page={currentOrderIndex + 1}
                        onChange={(event, value) => setCurrentOrderIndex(value - 1)}
                        color="primary"
                        sx={{ mt: 2, '& .MuiPagination-ul': { justifyContent: 'center', flexWrap: 'wrap' } }} // Ajustar la paginación para ser más compacta
                        siblingCount={0} // Reducir el número de botones visibles para mejorar la visualización
                        boundaryCount={1}
                    />
                </Box>
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

            {/* Dialogo para mostrar el resultado de la confirmación */}
            <Dialog open={openResultDialog} onClose={handleCloseResultDialog}>
                <DialogTitle>Resultado de la Confirmación</DialogTitle>
                <DialogContent>
                    <Typography>{resultMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultDialog} color="primary">Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PickerOrdenes;
