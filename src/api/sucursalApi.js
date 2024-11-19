import api from './api';

// Manejar autenticación expirada
const handleUnauthenticated = (errors) => {
    if (errors && errors.some(error => error.code === 'UNAUTHENTICATED')) {
        // Redirigir al login si el token ha caducado
        alert("La sesión actual ha finalizado");
        window.location.href = '/login';
        return true;
    }
    return false;
};

// Obtener todas las sucursales
export const getAllSucursales = async (token) => {
    const query = `
        query findAllSucursales {
            findAllSucursales {
                idTienda
                nombreSucursal
                direccion
                codigoPostal
                estado
                tipo
            }
        }
    `;

    try {
        const response = await api.post('', { query }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return [];
        }

        return response.data.data.findAllSucursales;
    } catch (error) {
        console.error('Error obteniendo sucursales:', error);
        return [];
    }
};

// Obtener sucursal por id
export const getSucursal = async (token, idSucursal) => {
    const query = `
        query getSucursal($idTienda: Int!) {
            getSucursal(idTienda: $idTienda) {
                idTienda
                nombreSucursal
                direccion
                codigoPostal
                estado
                tipo
            }
        }
    `;
    try {
        const response = await api.post('', {
            query,
            variables: {
                idTienda: parseInt(idSucursal)
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        return response.data.data.getSucursal;
    } catch (error) {
        console.error('Error obteniendo sucursal:', error);
        return null;
    }
};

// Crear una nueva sucursal
export const createSucursal = async (token, sucursalData) => {
    const mutation = `
        mutation createSucursal($createSucursalInput: CreateSucursalInput!) {
            createSucursal(createSucursalInput: $createSucursalInput) {
                idTienda
                nombreSucursal
                direccion
                codigoPostal
                estado
                tipo
            }
        }
    `;
    const variables = {
        createSucursalInput: sucursalData
    };
    
    try {
        const response = await api.post('', { query: mutation, variables }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        return response.data.data.createSucursal;
    } catch (error) {
        console.error('Error creando sucursal:', error);
        throw error;
    }
};

// Actualizar una sucursal existente
export const updateSucursal = async (token, sucursalData) => {
    const mutation = `
        mutation updateSucursal($updateSucursalInput: UpdateSucursalInput!) {
            updateSucursal(updateSucursalInput: $updateSucursalInput) {
                idTienda
                nombreSucursal
                direccion
                codigoPostal
                estado
                tipo
            }
        }
    `;
    const variables = {
        updateSucursalInput: sucursalData
    };
    
    try {
        const response = await api.post('', { query: mutation, variables }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        return response.data.data.updateSucursal;
    } catch (error) {
        console.error('Error actualizando sucursal:', error);
        throw error;
    }
};

// Eliminar una sucursal
export const removeSucursal = async (token, idTienda) => {
    const mutation = `
        mutation removeSucursal($idTienda: Int!) {
            removeSucursal(idTienda: $idTienda) {
                idTienda
                nombreSucursal
            }
        }
    `;
    const variables = {
        idTienda: parseInt(idTienda)
    };
    
    try {
        const response = await api.post('', { query: mutation, variables }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        return response.data.data.removeSucursal;
    } catch (error) {
        console.error('Error eliminando sucursal:', error);
        throw error;
    }
};
