import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../components/MenuPrincipal';
import { getSucursal } from '../api/sucursalApi';
import { Box, Typography, Avatar, List, ListItem, ListItemText, Paper, Chip, CircularProgress, Grid, Container } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import '../index.css';

const Home = () => {
  const [selectedTienda, setSelectedTienda] = useState('');
  const [sucursalAsignada, setSucursalAsignada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

      // Carga la sucursal asignada si no es Administrador Global
      getSucursal(savedUser.token, savedUser.idSucursal)
        .then((data) => {
          setSucursalAsignada(data.nombreSucursal); // Asigna la sucursal del usuario
          setSelectedTienda(data.idTienda); // Selecciona la tienda automáticamente
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener la sucursal asignada:', error);
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-purple-light)' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!user) {
    return <div>Error: No se pudo obtener la información del usuario.</div>; // Muestra un error si no hay usuario
  }

  const roleColors = {
    'Picker': 'var(--color-picker)',
    'Administrador de Tienda': 'var(--color-admin-tienda)',
    'Administrador Global': 'var(--color-admin-global)',
    'Encargado C&C': 'var(--color-encargado-cc)',
    'Coordinador SFS': 'var(--color-coordinador-sfs)'
  };

  return (
    <Container className="home-container" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar 
          alt="Backstore Logo" 
          src="images/backstore.png" // Ruta al archivo en la carpeta public
          sx={{ width: { xs: 300, md: 500 }, height: { xs: 120, md: 200 }, margin: '0 auto', transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }} 
        />
        <Typography variant="h4" sx={{ mt: 2, color: 'var(--color-purple-dark)', fontWeight: 'bold', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
          Bienvenido, {user.firstName} {user.lastName}!
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper elevation={4} sx={{ padding: 4, backgroundColor: 'var(--color-bg-white)', borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)', mb: 1 }}>Tienda asignada:</Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1, fontSize: { xs: '1rem', md: '1.3rem' } }}>
            {sucursalAsignada ? sucursalAsignada : 'No asignada'}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paper elevation={4} sx={{ padding: 4, backgroundColor: 'var(--color-bg-white)', borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-purple-dark)', mb: 2 }}>Roles de Usuario:</Typography>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {user.roles.map((role, index) => (
              <Grid item key={index}>
                <Chip 
                  icon={<AccountCircle />} 
                  label={role} 
                  variant="filled" 
                  sx={{ 
                    fontSize: '1rem', 
                    padding: '12px', 
                    backgroundColor: roleColors[role], 
                    color: 'var(--color-text-white)', 
                    fontWeight: 'bold', 
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      backgroundColor: 'var(--color-hover-purple)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
