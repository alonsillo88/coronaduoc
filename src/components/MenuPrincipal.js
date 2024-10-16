import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';


const MenuPrincipal = ({ role, selectedTienda, onTiendaChange, sucursales, user, sucursalAsignada, onLogout }) => {

    console.log(onLogout);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    // Definimos las opciones del menú en función del rol del usuario
    const menuItems = [
        { text: 'Home', roles: ['Picker', 'Administrador de Tienda', 'Administrador Global'], path: '/home' },
        { text: 'Órdenes para Picking', role: 'Picker', path: '/ordenes-picking' },
        { text: 'Administración de Tienda', role: 'Administrador de Tienda', path: '/admin-ordenes' },
        { text: 'Administración Global', role: 'Administrador Global', path: '/global-admin' }
    ];

    // Filtrar las opciones del menú según el rol del usuario
    const getMenuOptions = () => {
        if (role?.includes('Administrador Global')) {
            return menuItems;
        }
        return menuItems.filter(item => role?.includes(item.role));
    };

    const handleLogout = () => {
        if (onLogout) {
            console.log('Ejecutando handleLogout en MenuPrincipal...');
            onLogout(); // Se llama a la función de logout pasada por props
        } else {
            console.error("onLogout es undefined en MenuPrincipal");
        }
    };

    const handleNavigation = (path) => {
        console.log('MenuPrincipal.js: ejecutando handleNavigation con path:' + path);
        toggleDrawer(); // Cierra el menú
        navigate(path); // Navega a la ruta seleccionada
    };

    return (
        <div>
            <IconButton onClick={toggleDrawer} sx={{ position: 'absolute', top: 16, left: 16 }}>
                <MenuIcon sx={{ color: 'var(--color-purple-light)' }} />
            </IconButton>
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={toggleDrawer}
                PaperProps={{ sx: { width: 300, backgroundColor: 'var(--color-purple-dark)' } }}
            >
                <Box sx={{ p: 2, color: 'var(--color-text-white)', textAlign: 'center' }}>
                    {user ? (
                        <>
                            <img src="/images/backstore2.png" alt="Logo" style={{ width: '210px', marginBottom: '20px' }} />
                            <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>{user.email}</Typography>
                        </>
                    ) : (
                        <Typography variant="body2">Cargando usuario...</Typography>
                    )}
                </Box>
                <Box sx={{ p: 2, color: 'var(--color-text-white)', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '14px', color: 'var(--color-text-white)' }}>Tienda asignada:</Typography>

                    {role?.includes('Administrador Global') ? (
                        <select
                            id="tienda"
                            value={selectedTienda}
                            onChange={onTiendaChange}
                            className="custom-select"
                        >
                            <option value="" disabled hidden>Seleccione una tienda</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.idTienda} value={sucursal.idTienda} className="custom-option">
                                    {sucursal.nombreSucursal}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <Typography sx={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-text-white)' }}>
                            {sucursalAsignada ? sucursalAsignada : 'No asignada'}
                        </Typography>
                    )}
                </Box>

                <List>
                    {getMenuOptions().map((item, index) => (
                        <ListItem button key={index} onClick={() => handleNavigation(item.path)}>
                            <ListItemText primary={item.text} sx={{ color: 'var(--color-text-white)' }} />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    <ListItem button onClick={handleLogout}>
                        <ListItemText primary="Cerrar sesión" sx={{ color: 'var(--color-text-white)' }} />
                    </ListItem>
                </Box>
            </Drawer>
        </div>
    );
};

export default MenuPrincipal;

