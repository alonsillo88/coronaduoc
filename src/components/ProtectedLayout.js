import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuPrincipal from './MenuPrincipal';

const ProtectedLayout = ({ user, role, selectedTienda, onTiendaChange, sucursales, sucursalAsignada, onLogout }) => {
    if (!user || !role || !onLogout) {
        // Retorna un mensaje de carga o simplemente no renderiza hasta que estén todos los props
        window.location.reload();
        return <div>Entrando al sistema...</div>;
    }

    return (
        <div style={{ display: 'flex' }}>
            <MenuPrincipal
                role={role}
                selectedTienda={selectedTienda}
                onTiendaChange={onTiendaChange}
                sucursales={sucursales}
                user={user}
                sucursalAsignada={sucursalAsignada}
                onLogout={onLogout}
            />
            <div style={{ flex: 1, padding: '20px' }}>
                <Outlet /> {/* Aquí se renderizará el contenido de la ruta */}
            </div>
        </div>
    );
};

export default ProtectedLayout;

