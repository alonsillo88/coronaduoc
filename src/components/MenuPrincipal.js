import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Typography, Box, ListItemIcon, Divider, Select, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StoreIcon from '@mui/icons-material/Store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const MenuPrincipal = ({ role, selectedTienda, onTiendaChange, sucursales, user, sucursalAsignada, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    // Definimos las opciones del menú en función del rol del usuario
    const menuItems = [
        { text: 'Home', roles: ['Picker', 'Administrador de Tienda', 'Administrador Global'], path: '/home', icon: <HomeIcon /> },
        { text: 'Órdenes para Picking', roles: ['Picker'], path: '/ordenes-picking', icon: <AssignmentIcon /> },
        { text: 'Administración de Tienda', roles: ['Administrador de Tienda'], path: '/admin-ordenes', icon: <StoreIcon /> },
        { text: 'Administrar Usuarios', roles: ['Administrador Global'], path: '/admin-usuarios', icon: <PeopleIcon /> },
        { text: 'Administrar Sucursales', roles: ['Administrador Global'], path: '/admin-sucursales', icon: <BusinessIcon /> }
    ];

    // Filtrar las opciones del menú según el rol del usuario
    const getMenuOptions = () => {
        return menuItems.filter(item => item.roles.some(r => role?.includes(r)));
    };

    const handleLogout = () => {
        if (onLogout) {
            console.log('Ejecutando handleLogout en MenuPrincipal...');
            onLogout(); // Se llama a la función de logout pasada por props
            navigate('/login'); // Redirige al usuario a la página de login después de cerrar sesión
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
                <MenuIcon sx={{ color: 'var(--color-purple-light)', fontSize: 32 }} />
            </IconButton>
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={toggleDrawer}
                PaperProps={{ sx: { width: 260, backgroundColor: 'var(--color-purple-dark)', borderTopRightRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden' } }}
            >
                <Box sx={{ p: 2, color: 'var(--color-text-white)', textAlign: 'center' }}>
                    <img src="/images/backstore2.png" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
                </Box>
                <Box sx={{ p: 2, color: 'var(--color-text-white)', textAlign: 'center', borderBottom: '1px solid var(--color-purple-light)' }}>
                    <Typography sx={{ fontSize: '14px', color: 'var(--color-text-white)' }}>Tienda asignada:</Typography>

                    {role?.includes('Administrador Global') ? (
                        <select
                            id="tienda"
                            value={selectedTienda || ''}
                            onChange={(e) => onTiendaChange(e.target.value)}
                            className="custom-select"
                            style={{ padding: '8px', borderRadius: '8px', border: 'none', outline: 'none', width: '90%', marginTop: '10px' }}
                        >
                            <option value="" disabled hidden>Seleccione una tienda</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.idTienda} value={sucursal.idTienda}>
                                    {sucursal.nombreSucursal}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <Typography sx={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-text-white)', mt: 1 }}>
                            {sucursalAsignada ? sucursalAsignada : 'No asignada'}
                        </Typography>
                    )}
                </Box>

                <List sx={{ mt: 2 }}>
                    {getMenuOptions().map((item, index) => (
                        <ListItem button key={index} onClick={() => handleNavigation(item.path)} sx={{ mb: 1, borderRadius: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                            <ListItemIcon sx={{ color: 'var(--color-text-white)', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: 'var(--color-text-white)', fontWeight: 600, fontSize: '16px' }} />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ backgroundColor: 'var(--color-purple-light)', mt: 2 }} />
                <Box sx={{ position: 'absolute', bottom: 0, width: '100%', color: 'var(--color-text-white)', textAlign: 'center', p: 2 }}>
                    {user && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" sx={{ mb: 0.5 }}>{user.firstName} {user.lastName}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>{user.email}</Typography>
                        </Box>
                    )}
                    <ListItem button onClick={handleLogout} sx={{ justifyContent: 'center', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                        <ListItemIcon sx={{ color: 'var(--color-text-white)' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cerrar sesión" sx={{ color: 'var(--color-text-white)', fontWeight: 600, fontSize: '16px' }} />
                    </ListItem>
                </Box>
            </Drawer>
        </div>
    );
};

export default MenuPrincipal;
