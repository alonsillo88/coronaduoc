import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../components/MenuPrincipal';
import { getSucursal } from '../api/sucursalApi';
import { Box, Typography, Avatar, List, ListItem, ListItemText, Paper } from '@mui/material';

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
    return <div>Cargando...</div>; // Muestra un mensaje mientras se carga la data
  }

  if (!user) {
    return <div>Error: No se pudo obtener la información del usuario.</div>; // Muestra un error si no hay usuario
  }

  return (
    <div className="home-container">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Avatar 
          alt="Backstore Logo" 
          src="images/backstore.png" // Ruta al archivo en la carpeta public
          sx={{ width: 500, height:200, margin: '0 auto' }} 
        />
        <Typography variant="h4" sx={{ mt: 2 }}>
          Bienvenido, {user.firstName} {user.lastName}!
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5">Tienda asignada:</Typography>
          <Typography variant="h6" color="primary">
            {sucursalAsignada ? sucursalAsignada : 'No asignada'}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>Roles de Usuario:</Typography>
          <List>
            {user.roles.map((role, index) => (
              <ListItem key={index}>
                <ListItemText primary={role} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default Home;
