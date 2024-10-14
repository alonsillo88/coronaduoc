import api from './api';

export const getAllSucursales = async (token) => {

    const query = `
        query findAllSucursales {
            findAllSucursales {
                idTienda
                nombreSucursal
            }
        }
    `;

    try {
        const response = await api.post('', { query }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
      
        return response.data.data.findAllSucursales;
    } catch (error) {
        console.error('Error obteniendo sucursales:', error);
        return [];
    }
};

export const getSucursal = async (token, idSucursal) => {
    const query = `
        query getSucursal($idTienda:  Int!) {
            getSucursal(idTienda: $idTienda) {
                idTienda
                nombreSucursal
            }
        }
    `;
    try {
        const response = await api.post('', { query, 
            variables: {
                idTienda: parseInt(idSucursal)
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data.getSucursal;
    } catch (error) {
        console.error('Error obteniendo sucursales:', error);
        return [];
    }
};
