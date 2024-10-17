import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../components/MenuPrincipal';
import { getAllSucursales, getSucursal } from '../api/sucursalApi';


const Home = () => {
  const [selectedTienda, setSelectedTienda] = useState('');
  const [sucursales, setSucursales] = useState([]);
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
      <div className="welcome-container">
        <h2>Bienvenido {user.firstName} {user.lastName}!</h2>

    
          <div>
            Tienda asignada: <br/> <h3>{sucursalAsignada ? sucursalAsignada : 'No asignada'}</h3>
          </div>
       

    
      </div>
    </div>
  );
};

export default Home;
