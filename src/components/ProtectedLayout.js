import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuPrincipal from './MenuPrincipal'; 

const ProtectedLayout = ({ user, role, selectedTienda, onTiendaChange, sucursales, sucursalAsignada, onLogout }) => {
    return (
        <div style={{ display: 'flex' }}>
            {/* El menú estará siempre visible en la izquierda */}
            <MenuPrincipal 
                role={role} 
                selectedTienda={selectedTienda} 
                onTiendaChange={onTiendaChange} 
                sucursales={sucursales} 
                user={user} 
                sucursalAsignada={sucursalAsignada} 
                onLogout={onLogout} 
            />
            {/* El contenido principal de la página según la ruta */}
            <div style={{ flex: 1, padding: '20px' }}>
                <Outlet /> {/* Aquí se renderizará el contenido de la ruta */}
            </div>
        </div>
    );
};

export default ProtectedLayout;
