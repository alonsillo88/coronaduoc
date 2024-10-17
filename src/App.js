import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Home from './views/Home';
import PickerOrdenes from './views/PickerOrdenes';
import GestionOrdenes from './views/GestionOrdenes';
import AdminUsuarios from './views/AdminUsuarios';
import AdminSucursales from './views/AdminSucursales';
import ProtectedLayout from './components/ProtectedLayout';
import { getAllSucursales, getSucursal } from './api/sucursalApi';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [sucursalAsignada, setSucursalAsignada] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const savedUser = {
        firstName: localStorage.getItem('nombreUsuario'),
        lastName: localStorage.getItem('apellidoUsuario'),
        email: localStorage.getItem('emailUsuario'),
        roles: JSON.parse(localStorage.getItem('rolesUsuario')),
        idSucursal: localStorage.getItem('idSucursal'),
      };
      setUser(savedUser);
      setSelectedTienda(savedUser.idSucursal);
      setIsAuthenticated(true);

      // Si el usuario es Administrador Global, carga todas las sucursales
      if (savedUser.roles.includes('Administrador Global')) {
        getAllSucursales(token)
          .then((data) => {
            setSucursales(data);
          })
          .catch((error) => {
            console.error('Error al obtener sucursales:', error);
          });
      } else {
        // Si no es Administrador Global, carga solo la sucursal asignada
        getSucursal(token, savedUser.idSucursal)
          .then((data) => {
            setSucursalAsignada(data.nombreSucursal);
            setSelectedTienda(data.idTienda);
          })
          .catch((error) => {
            console.error('Error al obtener la sucursal asignada:', error);
          });
      }
    } else {
      setIsAuthenticated(false);
    }
    setUserLoaded(true);
  }, []); // Removido isAuthenticated para evitar recargas innecesarias

  const handleLogout = () => {
    console.log("App.js: se ejecuta el HandleLogout");
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setSucursales([]);
    setSucursalAsignada(null);
  };

  const handleTiendaChange = (e) => {
    const selectedId = e;
    setSelectedTienda(selectedId);
    localStorage.setItem("idSucursal", selectedId);
    console.log("Tienda seleccionada:", selectedId);
    window.location.reload();
    if (user?.roles.includes('Administrador Global')) {
      const nuevaSucursal = sucursales.find((sucursal) => sucursal.idTienda === selectedId);
      setSucursalAsignada(nuevaSucursal ? nuevaSucursal.nombreSucursal : 'No asignada');
    }
  };

  useEffect(() => {
    // Sincronizar la tienda seleccionada en el almacenamiento local
    if (selectedTienda) {
      localStorage.setItem('selectedTienda', selectedTienda);
    }
  }, [selectedTienda]);

  if (!userLoaded) {
    return <div>Cargando...</div>; // Mostrar pantalla de carga mientras se cargan los datos
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        <Route
          element={
            <ProtectedLayout
              user={user}
              role={user?.roles}
              selectedTienda={selectedTienda}
              onTiendaChange={handleTiendaChange}
              sucursales={sucursales}
              sucursalAsignada={sucursalAsignada}
              onLogout={handleLogout}
            />
          }
        >
          <Route
            path="/home"
            element={isAuthenticated ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/ordenes-picking"
            element={
              isAuthenticated && user?.roles.includes('Picker') ? (
                <PickerOrdenes 
                user={user} 
                token={localStorage.getItem('token')}
                selectedTienda={selectedTienda}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin-ordenes"
            element={
              isAuthenticated && user?.roles.includes('Administrador de Tienda') ? (
                <GestionOrdenes
                  user={user}
                  role={user?.roles}
                  selectedTienda={selectedTienda}
                  token={localStorage.getItem('token')}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin-usuarios"
            element={
              isAuthenticated && user?.roles.includes('Administrador Global') ? (
                <AdminUsuarios user={user} token={localStorage.getItem('token')} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin-sucursales"
            element={
              isAuthenticated && user?.roles.includes('Administrador Global') ? (
                <AdminSucursales user={user} token={localStorage.getItem('token')} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
