import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Switch, FormControlLabel, Alert, FormGroup, FormControl, FormLabel, Checkbox, Select, MenuItem } from '@mui/material';
import { getAllUsuarios, createUsuario, updateUsuario, removeUsuario, updatePassword } from '../api/usuarioApi';
import { getAllSucursales } from '../api/sucursalApi';

const AdminUsuarios = ({ token }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState(''); // 'add' | 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [idSucursal, setIdSucursal] = useState('');
    const [roles, setRoles] = useState([]);
    const [estado, setEstado] = useState(true); // True: Activo, False: Inactivo
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const usuariosData = await getAllUsuarios(token);
            setUsuarios(usuariosData);
        };
        const fetchSucursales = async () => {
            const sucursalesData = await getAllSucursales(token);
            console.log(sucursalesData);
            setSucursales(sucursalesData);
        };
        fetchUsuarios();
        fetchSucursales();
    }, [token]);

    const handleAddUser = () => {
        setDialogMode('add');
        setSelectedUser(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setRut('');
        setIdSucursal('');
        setRoles([]);
        setEstado(true);
        setOpenDialog(true);
    };

    const handleEditUser = (user) => {
        setDialogMode('edit');
        setSelectedUser(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setRut(user.rut);
        setIdSucursal(user.idSucursal);
        setRoles(user.roles);
        setEstado(user.estado === 'activo');
        setOpenDialog(true);
    };

    const handleDeleteUser = async () => {
        if (userToDelete) {
            const success = await removeUsuario(token, userToDelete.email);
            if (success) {
                setUsuarios(usuarios.filter(user => user.email !== userToDelete.email));
                setAlert({ type: 'success', message: 'Usuario eliminado correctamente.' });
            } else {
                setAlert({ type: 'error', message: 'Error al eliminar el usuario.' });
            }
            setOpenDeleteDialog(false);
            setUserToDelete(null);
        }
    };

    const handleOpenDeleteDialog = (user) => {
        setUserToDelete(user);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setUserToDelete(null);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async () => {
        const userData = {
            email,
            firstName,
            lastName,
            password: password || (dialogMode === 'add' ? 'password123' : undefined), // Default password for new users
            rut,
            idSucursal,
            roles,
            estado: estado ? 'activo' : 'inactivo'
        };

        if (dialogMode === 'add') {
            const newUser = await createUsuario(token, userData);
            if (newUser) {
                setUsuarios([...usuarios, newUser]);
                setAlert({ type: 'success', message: 'Usuario creado exitosamente.' });
            } else {
                setAlert({ type: 'error', message: 'Error al crear el usuario.' });
            }
        } else if (dialogMode === 'edit') {
            const updatedUser = await updateUsuario(token, userData);
            if (updatedUser) {
                setUsuarios(usuarios.map(user => user.email === updatedUser.email ? updatedUser : user));
                setAlert({ type: 'success', message: 'Usuario actualizado exitosamente.' });
            } else {
                setAlert({ type: 'error', message: 'Error al actualizar el usuario.' });
            }
        }

        handleDialogClose();
    };

    const handleRoleChange = (role) => {
        setRoles(prevRoles =>
            prevRoles.includes(role)
                ? prevRoles.filter(r => r !== role)
                : [...prevRoles, role]
        );
    };

    const handleOpenPasswordDialog = (user) => {
        setSelectedUser(user);
        setNewPassword('');
        setOpenPasswordDialog(true);
    };

    const handleClosePasswordDialog = () => {
        setOpenPasswordDialog(false);
        setSelectedUser(null);
    };

    const handleUpdatePassword = async () => {
        if (newPassword && selectedUser) {
            const success = await updatePassword(token, selectedUser.email, newPassword);
            if (success) {
                setAlert({ type: 'success', message: 'Contraseña actualizada exitosamente.' });
            } else {
                setAlert({ type: 'error', message: 'Error al actualizar la contraseña.' });
            }
            handleClosePasswordDialog();
        }
    };
 
    const columns = [

        
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'firstName', headerName: 'Nombre', width: 200 },
        { field: 'lastName', headerName: 'Apellido', width: 200 },
        { 
            field: 'idSucursal', 
            headerName: 'ID Sucursal', 
            width: 150, 
            renderCell: (params) => {
                const sucursal = sucursales.find(s => s.idTienda.toString() === params.value);
                return `${params.value} - ${sucursal ? sucursal.nombreSucursal : 'Desconocido'}`;
            }
        },
        { 
            field: 'roles', 
            headerName: 'Roles', 
            width: 200, 
            renderCell: (params) => (
                <Box>
                    {params.value.map((role, index) => (
                        <Typography key={index} variant="body2" sx={{ fontSize: '0.7rem' }}>
                            {role}
                        </Typography>
                    ))}
                </Box>
            )
        },
        { field: 'estado', headerName: 'Estado', width: 150 },
        {
            field: 'acciones',
            headerName: 'Acciones',
            width: 300,
            renderCell: (params) => (
                <>
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEditUser(params.row)} sx={{ mr: 1 }}>
                        Editar
                    </Button>
                    <Button variant="contained" color="secondary" size="small" onClick={() => handleOpenPasswordDialog(params.row)} sx={{ mr: 1 }}>
                        Password
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={() => handleOpenDeleteDialog(params.row)}>
                        Eliminar
                    </Button>
                </>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Administración de Usuarios</Typography>
            {alert.message && (
                <Alert severity={alert.type} onClose={() => setAlert({ type: '', message: '' })} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}
            <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ mb: 2 }}>
                Agregar Usuario
            </Button>
            <DataGrid 
                rows={usuarios} 
                columns={columns} 
                pageSize={5} 
                autoHeight 
                getRowId={(row) => row.email} // Usar email como identificador único
            />

            {/* Dialog para agregar/editar usuario */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{dialogMode === 'add' ? 'Agregar Usuario' : 'Editar Usuario'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Apellido"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={dialogMode === 'edit'}
                    />
                    {dialogMode === 'add' && (
                        <TextField
                            margin="dense"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}
                    <TextField
                        margin="dense"
                        label="RUT"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <FormLabel>Sucursal</FormLabel>
                        <Select
                            value={idSucursal}
                            onChange={(e) => setIdSucursal(e.target.value)}
                        >
                            {sucursales.map((sucursal) => (
                                <MenuItem key={sucursal.idTienda} value={sucursal.idTienda.toString()}>
                                    {sucursal.nombreSucursal}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Roles</FormLabel>
                        <FormGroup>
                            <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={roles.includes('Picker')} onChange={() => handleRoleChange('Picker')} />}
                                    label="Picker"
                                />
                            </Box>
                            <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={roles.includes('Administrador de Tienda')} onChange={() => handleRoleChange('Administrador de Tienda')} />}
                                    label="Administrador de Tienda"
                                />
                            </Box>
                            <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={roles.includes('Administrador Global')} onChange={() => handleRoleChange('Administrador Global')} />}
                                    label="Administrador Global"
                                />
                            </Box>
                        </FormGroup>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={estado}
                                onChange={(e) => setEstado(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Activo"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancelar</Button>
                    <Button onClick={handleSaveUser} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para actualizar contraseña */}
            <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
                <DialogTitle>Actualizar Contraseña</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nueva Contraseña"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePasswordDialog} color="primary">Cancelar</Button>
                    <Button onClick={handleUpdatePassword} color="primary">Actualizar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para confirmar eliminación */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar este usuario?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">Cancelar</Button>
                    <Button onClick={handleDeleteUser} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUsuarios;
