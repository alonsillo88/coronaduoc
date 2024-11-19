import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Switch, FormControlLabel, Alert, Backdrop, CircularProgress, Grid } from '@mui/material';
import { getAllSucursales, createSucursal, updateSucursal, removeSucursal } from '../api/sucursalApi';

const AdminSucursales = ({ token }) => {
    const [sucursales, setSucursales] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState(''); // 'add' | 'edit'
    const [selectedSucursal, setSelectedSucursal] = useState(null);
    const [idTienda, setIdTienda] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [tipo, setTipo] = useState('');
    const [estado, setEstado] = useState(true); // True: Activa, False: Inactiva
    const [alert, setAlert] = useState({ type: '', message: '', visible: false });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSucursales = async () => {
            setLoading(true);
            try {
                const sucursalesData = await getAllSucursales(token);
                // Asigna `idTienda` a `id` para que cada fila tenga un identificador único
                const updatedSucursales = sucursalesData.map(sucursal => ({
                    ...sucursal,
                    id: sucursal.idTienda
                }));
                setSucursales(updatedSucursales);
            } catch (error) {
                setAlert({ type: 'error', message: 'Error al obtener las sucursales.', visible: true });
            } finally {
                setLoading(false);
            }
        };
        fetchSucursales();
    }, [token]);

    const handleAddSucursal = () => {
        setDialogMode('add');
        setSelectedSucursal(null);
        setIdTienda('');
        setNombre('');
        setDireccion('');
        setCodigoPostal('');
        setTipo('');
        setEstado(true);
        setOpenDialog(true);
    };

    const handleEditSucursal = (sucursal) => {
        setDialogMode('edit');
        setSelectedSucursal(sucursal);
        setIdTienda(sucursal.idTienda);
        setNombre(sucursal.nombreSucursal);
        setDireccion(sucursal.direccion);
        setCodigoPostal(sucursal.codigoPostal);
        setTipo(sucursal.tipo);
        setEstado(sucursal.estado === 'activa');
        setOpenDialog(true);
    };

    const handleDeleteSucursal = async (sucursalId) => {
        setLoading(true);
        try {
            await removeSucursal(token, sucursalId);
            setSucursales(sucursales.filter(sucursal => sucursal.idTienda !== sucursalId));
            setAlert({ type: 'success', message: 'Sucursal eliminada correctamente.', visible: true });
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al eliminar la sucursal.', visible: true });
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedSucursal(null);
    };

    const handleSaveSucursal = async () => {
        if (!idTienda || !nombre || !direccion || !codigoPostal || !tipo) {
            setAlert({ type: 'warning', message: 'Todos los campos son obligatorios.', visible: true });
            return;
        }

        const sucursalData = {
            idTienda: parseInt(idTienda) || null,
            nombreSucursal: nombre,
            direccion,
            codigoPostal,
            estado: estado ? 'activa' : 'inactiva',
            tipo
        };

        setLoading(true);
        try {
            if (dialogMode === 'add') {
                const newSucursal = await createSucursal(token, sucursalData);
                if (newSucursal) {
                    setSucursales([...sucursales, { ...newSucursal, id: newSucursal.idTienda }]);
                    setAlert({ type: 'success', message: 'Sucursal agregada correctamente.', visible: true });
                }
            } else if (dialogMode === 'edit') {
                const updatedSucursal = await updateSucursal(token, sucursalData);
                if (updatedSucursal) {
                    setSucursales(sucursales.map(sucursal => sucursal.idTienda === updatedSucursal.idTienda ? { ...updatedSucursal, id: updatedSucursal.idTienda } : sucursal));
                    setAlert({ type: 'success', message: 'Sucursal actualizada correctamente.', visible: true });
                }
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al guardar la sucursal.', visible: true });
        } finally {
            setLoading(false);
            handleDialogClose();
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredSucursales = sucursales.filter((sucursal) =>
        sucursal.nombreSucursal.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { field: 'idTienda', headerName: 'ID Tienda', width: 100 },
        { field: 'nombreSucursal', headerName: 'Nombre', width: 200 },
        { field: 'direccion', headerName: 'Dirección', width: 300 },
        { field: 'codigoPostal', headerName: 'Código Postal', width: 150 },
        { field: 'tipo', headerName: 'Tipo', width: 150 },
        { field: 'estado', headerName: 'Estado', width: 150 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEditSucursal(params.row)} sx={{ mr: 1 }}>
                        Editar
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={() => handleDeleteSucursal(params.row.idTienda)}>
                        Eliminar
                    </Button>
                </>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Typography variant="h4" gutterBottom>Administración de Sucursales</Typography>
            {alert.visible && (
                <Alert severity={alert.type} onClose={() => setAlert({ ...alert, visible: false })} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Buscar Sucursales"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleAddSucursal} sx={{ mb: 2 }}>
                Agregar Sucursal
            </Button>
            <DataGrid 
                rows={filteredSucursales} 
                columns={columns} 
                autoHeight 
                getRowId={(row) => row.idTienda} // Usar idTienda como identificador único
                rowsPerPageOptions={[]}
            />

            {/* Dialog para agregar/editar sucursal */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>{dialogMode === 'add' ? 'Agregar Sucursal' : 'Editar Sucursal'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="ID Tienda"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={idTienda}
                        onChange={(e) => setIdTienda(e.target.value)}
                        disabled={dialogMode === 'edit'}
                    />
                    <TextField
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Dirección"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Código Postal"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Tipo de Tienda"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={estado}
                                onChange={(e) => setEstado(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Activa"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancelar</Button>
                    <Button onClick={handleSaveSucursal} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminSucursales;
