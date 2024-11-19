import React, { useState, useEffect } from 'react';
import { DataGrid, esES, GridToolbar } from '@mui/x-data-grid';
import { getOrdersForStore, assignOrdersToPicker, getPickersBySucursal } from '../api/orderApi';
import { Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert, IconButton, Grid, Card, CardContent, CircularProgress, Backdrop, Chip, Paper, Divider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllSucursales, getSucursal } from '../api/sucursalApi';
import DeleteIcon from '@mui/icons-material/Delete';

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
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const [alertMessage, setAlertMessage] = useState({ message: '', severity: 'info' });
    const [addedOrders, setAddedOrders] = useState([]);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        setBackdropOpen(true);
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
            if (savedUser.roles.includes('Administrador de Tienda')) {
                getSucursal(savedUser.token, savedUser.idSucursal)
                    .then((data) => {
                        setSucursalAsignada(data.nombreSucursal);
                        setSelectedTienda(data.idTienda); // Selecciona la tienda automáticamente
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error al obtener la sucursal asignada:', error);
                        setLoading(false);
                    })
                    .finally(() => {
                        setBackdropOpen(false);
                    });
            } else {
                console.error('Rol inválido.');
                setLoading(false);
                setBackdropOpen(false);
            }
        } else {
            setLoading(false);
            setBackdropOpen(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setBackdropOpen(true);
                const response = await getOrdersForStore(user.token, selectedTienda);
                console.log(response);

                // Verifica si la respuesta tiene la estructura esperada antes de acceder a `getOrders`
                if (response) {
                    setOrders(response);
                } else {
                    console.error('Estructura de respuesta inesperada:', response);
                    setOrders([]); // Asegura que no queden órdenes antiguas si la estructura no es válida
                }

                // Obtener pickers para la tienda seleccionada
                const fetchedPickers = await getPickersBySucursal(user.token, selectedTienda);
                setPickers(fetchedPickers);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setOrders([]); // Asegura que no haya órdenes antiguas si ocurre un error
            } finally {
                setLoading(false);
                setBackdropOpen(false);
            }
        };

        if (user && selectedTienda) {
            fetchData();
        }
    }, [user, selectedTienda]);

    const handleAddOrder = (order) => {
        if (!addedOrders.includes(order.externalOrderId)) {
            setAddedOrders([...addedOrders, order.externalOrderId]);
        }
    };

    const handleRemoveOrder = (orderId) => {
        setAddedOrders(addedOrders.filter(id => id !== orderId));
    };

    const handleAssignPicker = async () => {
        if (!selectedPicker) {
            setAlertMessage({ message: 'Debe seleccionar un picker para poder asignar la orden', severity: 'warning' });
            return;
        }
        if (addedOrders.length > 0) {
            setDialogAction(() => async () => {
                try {
                    setBackdropOpen(true);
                    await assignOrdersToPicker(user.token, selectedPicker, addedOrders, user.email);
                    const updatedOrders = await getOrdersForStore(user.token, selectedTienda);
                    setOrders(updatedOrders);
                    setAddedOrders([]);
                    setSelectedPicker('');
                    setAlertMessage({ message: 'Órdenes asignadas correctamente', severity: 'success' });
                } catch (error) {
                    console.error('Error al asignar órdenes:', error);
                    setAlertMessage({ message: 'Error al asignar órdenes', severity: 'error' });
                } finally {
                    setBackdropOpen(false);
                }
            });
            setOpenConfirmDialog(true);
        } else {
            setAlertMessage({ message: 'Debe agregar al menos una orden', severity: 'warning' });
        }
    };

    const handleAssignSingleOrder = (orderId) => {
        if (!selectedPicker) {
            setAlertMessage({ message: 'Debe seleccionar un picker para poder asignar la orden', severity: 'warning' });
            return;
        }
        setDialogAction(() => async () => {
            try {
                setBackdropOpen(true);
                await assignOrdersToPicker(user.token, selectedPicker, [orderId], user.email);
                const updatedOrders = await getOrdersForStore(user.token, selectedTienda);
                setOrders(updatedOrders);
                handleRemoveOrder(orderId);
                setAlertMessage({ message: 'Orden asignada correctamente', severity: 'success' });
            } catch (error) {
                console.error('Error al asignar la orden:', error);
                setAlertMessage({ message: 'Error al asignar la orden', severity: 'error' });
            } finally {
                setBackdropOpen(false);
            }
        });
        setOpenConfirmDialog(true);
    };

    const handleTiendaChange = (selectedId) => {
        setSelectedTienda(selectedId);
        const nuevaSucursal = sucursales.find((sucursal) => sucursal.idTienda === selectedId);
        setSucursalAsignada(nuevaSucursal);
    };

    const handleOpenDetailDialog = (order) => {
        setSelectedOrderDetails(order);
        setOpenDetailDialog(true);
    };

    const handleCloseDetailDialog = () => {
        setOpenDetailDialog(false);
        setSelectedOrderDetails(null);
    };

    const columns = [
        { 
            field: 'externalOrderId', 
            headerName: 'Orden de Venta', 
            width: isMobile ? 100 : 150, 
            renderCell: (params) => (
                <Typography variant="h6" color="primary" sx={{fontSize: '16px', fontWeight: 'bold' }}>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'orderCorona', 
            headerName: 'Orden Corona', 
            width: isMobile ? 100 : 150, 
            valueGetter: (params) => params.row.externalSequenceNumber,
            renderCell: (params) => (
                <Typography variant="h6" color="secondary" sx={{fontSize: '16px', fontWeight: 'bold' }}>
                    {params.value}
                </Typography>
            )
        },
        { field: 'cliente', headerName: 'Cliente', width: isMobile ? 100 : 150, valueGetter: (params) => `${params.row.customer.firstName} ${params.row.customer.lastName}` },
        { field: 'entrega', headerName: 'Entrega', width: isMobile ? 100 : 150, valueGetter: (params) => params.row.logisticsInfo.deliveryType === 'delivery' ? 'Despacho' : 'Ret. Tienda' },
        {
            field: 'productos',
            headerName: 'Cantidad productos',
            width: isMobile ? 100 : 150,
            valueGetter: (params) => {
                const totalQuantity = params.row.items.reduce((acc, item) => acc + item.quantity, 0);
                return `${totalQuantity}`;
            }
        },
        { field: 'fechaOrden', headerName: 'Fecha Orden', width: isMobile ? 100 : 150, valueGetter: (params) => params.row.creationDate ? new Date(params.row.creationDate).toLocaleString() : 'N/A' },
        { field: 'estadoOrden', headerName: 'Estado Orden', width: isMobile ? 100 : 150, valueGetter: (params) => params.row.orderStatusDescription === 'pedido con pago aprobado' ? 'Pago Aprobado' : params.row.orderStatusDescription || 'N/A' },
        {
            field: 'estadoBackstore',
            headerName: 'Estado Backstore',
            width: isMobile ? 100 : 150,
            valueGetter: (params) => params.row.orderBackstoreStatus || 'Pendiente',
            renderCell: (params) => (
                <Typography
                    sx={{
                        fontWeight: 800,
                        color: params.value === 'Pendiente' ? 'blue' :
                            params.value === 'Confirmada' ? 'green' :
                            params.value === 'Quiebre Parcial' ? 'orange' :
                            params.value === 'Quiebre Total' ? 'red' : 'inherit'
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'Asignación',
            headerName: 'Asignación',
            width: isMobile ? 100 : 200,
            renderCell: (params) => (
                params.row.assignment ? (
                    <Box>
                        <Typography variant="body2">
                            {params.row.assignment.assignedTo}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {new Date(params.row.assignment.assignmentDate).toLocaleString()}
                        </Typography>
                    </Box>
                ) : 'Pendiente'
            )
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: isMobile ? 220 : 290,
            align: 'left',
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {params.row.orderBackstoreStatus === 'Pendiente' || params.row.orderBackstoreStatus === null ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() => handleAssignSingleOrder(params.row.externalOrderId)}
                            >
                                Asignar
                            </Button>
                            {addedOrders.includes(params.row.externalOrderId) ? (
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    sx={{ ml: 1 }}
                                    onClick={() => handleRemoveOrder(params.row.externalOrderId)}
                                >
                                    Quitar
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={{ ml: 1 }}
                                    onClick={() => handleAddOrder(params.row)}
                                >
                                    Agregar
                                </Button>
                            )}
                        </>
                    ) : null}
                    <Button variant="contained" color="secondary" size="small" sx={{ ml: 1 }} onClick={() => handleOpenDetailDialog(params.row)}>
                        Detalle
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div>
            <Backdrop open={backdropOpen} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box sx={{ height: 600, width: '100%', padding: 0 }}>
                <Typography variant="h4" sx={{paddingLeft:'40px', mb: 2 }}>
                    Gestión de Órdenes
                </Typography>
                {alertMessage.message && <Alert severity={alertMessage.severity} onClose={() => setAlertMessage({ message: '', severity: 'info' })} sx={{ mb: 2 }}>{alertMessage.message}</Alert>}
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
                        sx={{ height: 55 }}
                    >
                        Asignar Órdenes
                    </Button>
                </Box>

                <Paper elevation={3} sx={{ mb: 2, p: 2, borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Órdenes para asignar a picker seleccionado:</Typography>
                    <Divider />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {addedOrders.length === 0 ? (
                            <Typography variant="body2">Ninguna orden agregada</Typography>
                        ) : (
                            addedOrders.map((orderId) => (
                                <Chip
                                    key={orderId}
                                    label={orderId}
                                    onDelete={() => handleRemoveOrder(orderId)}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            ))
                        )}
                    </Box>
                </Paper>

                {loading ? (
                    <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <DataGrid
                            rows={orders}
                            columns={columns}
                            pageSize={10}
                            autoHeight
                            disableSelectionOnClick={true}
                            getRowId={(row) => row.externalOrderId} // Usamos `externalOrderId` como `id`
                            localeText={{
                                ...esES.components.MuiDataGrid.defaultProps.localeText,
                                noRowsLabel: 'No hay órdenes disponibles'
                            }}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            sx={{
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'var(--color-purple-dark)',
                                    color: 'white'
                                },
                                '& .MuiDataGrid-cell': {
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                },
                                '& .MuiDataGrid-row': {
                                    backgroundColor: (params) => addedOrders.includes(params.id) ? 'rgba(98, 0, 234, 0.1)' : 'inherit'
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>

            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>Confirmar Asignación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro que desea asignar la(s) orden(es) seleccionada(s)?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenConfirmDialog(false);
                            if (dialogAction) dialogAction();
                        }}
                        color="primary"
                        autoFocus
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDetailDialog}
                onClose={handleCloseDetailDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Detalle de la Orden</DialogTitle>
                <DialogContent>
                    {selectedOrderDetails && (
                        <Grid container spacing={2}>
                            {selectedOrderDetails.items.map((item) => (
                                <Grid item xs={12} sm={6} key={item.productId}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <img src={item.imageUrl} alt={item.skuName} style={{ width: 'auto', height: '150px', borderRadius: '8px', marginBottom: '10px' }} />
                                                <Typography variant="h6" align="center" gutterBottom>{item.skuName}</Typography>
                                                <Typography variant="body2">EAN: {item.ean}</Typography>
                                                <Typography variant="body2">Cantidad: {item.quantity}</Typography>
                                                <Typography variant="body2">Cantidad Confirmada Backstore: {item.quantityConfirmedBackstore || 0}</Typography>
                                                <Typography variant="body2">Color: {item.color}</Typography>
                                                <Typography variant="body2">Talla: {item.size}</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetailDialog} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default GestionOrdenes;
