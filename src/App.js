import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Home from './views/Home';
import PickerOrdenes from './views/PickerOrdenes';
import GestionOrdenes from './views/GestionOrdenes';
import ProtectedLayout from './components/ProtectedLayout';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [userLoaded, setUserLoaded] = useState(false); // Controla si los datos del usuario están cargados

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
      setSelectedTienda(savedUser.idSucursal); // Establece la tienda desde el localStorage
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false); // Asegurarse de que el usuario esté no autenticado si no hay token
    }
    setUserLoaded(true); // Señalamos que los datos del usuario ya se han cargado
  
    console.log("App.js: Estado de isAuthenticated y userLoaded después del useEffect:", { isAuthenticated, userLoaded });
  }, []);
  

  const handleLogout = () => {
    console.log("App.js: se ejecuta el HandleLogout")
    localStorage.clear(); // Limpiamos localStorage al cerrar sesión
    setIsAuthenticated(false); // Actualizamos el estado de autenticación
    setUser(null); // Limpiamos el estado del usuario
  };

  if (!userLoaded) {
    return <div>Cargando...</div>; // Mostrar pantalla de carga mientras se cargan los datos
  }

  return (
    <Router>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedLayout user={user} role={user?.roles} selectedTienda={selectedTienda} onLogout={() => handleLogout} />}>
          <Route
            path="/home"
            element={isAuthenticated ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route
            path="/ordenes-picking"
            element={isAuthenticated && user?.roles.includes('Picker') ? <PickerOrdenes user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-ordenes"
            element={isAuthenticated && user?.roles.includes('Administrador de Tienda') ? <GestionOrdenes user={user} role={user?.roles} selectedTienda={selectedTienda} token={localStorage.getItem('token')} /> : <Navigate to="/login" />}
          />
        </Route>

        {/* Redirigir al home si está autenticado, de lo contrario al login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
