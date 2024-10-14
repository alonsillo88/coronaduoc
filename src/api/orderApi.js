import api from './api'; // Aquí usas la configuración base de `api.js`

// Obtener órdenes de la tienda
export const getOrdersForStore = async () => {
    try {
        const query = `
        query {
            getOrdersForStore {
            id
            description
            status
            createdAt
            assignedPicker {
                id
                name
            }
            }
        }
        `;

        const response = await api.post('', { query });
        return response.data.data.getOrdersForStore;
    } catch (error) {
        console.error('Error al obtener las órdenes de la tienda:', error);
        return [];
    }
};

// Obtener pickers disponibles para la tienda
export const getPickers = async () => {
    try {
        const query = `
        query {
            getPickers {
            id
            name
            }
        }
        `;

        const response = await api.post('', { query });
        return response.data.data.getPickers;
    } catch (error) {
        console.error('Error al obtener los pickers:', error);
        return [];
    }
};

// Asignar una orden a un picker
export const assignOrderToPicker = async (orderId, pickerId) => {
    try {
        const mutation = `
        mutation assignOrderToPicker($orderId: ID!, $pickerId: ID!) {
            assignOrderToPicker(orderId: $orderId, pickerId: $pickerId) {
            success
            message
            order {
                id
                description
                status
                assignedPicker {
                id
                name
                }
            }
            }
        }
        `;

        const variables = {
        orderId,
        pickerId,
        };

        const response = await api.post('', { query: mutation, variables });
        return response.data.data.assignOrderToPicker;
    } catch (error) {
        console.error(`Error al asignar la orden ${orderId} al picker ${pickerId}:`, error);
        throw error;
    }
};


export const getOrdenesByPicker = async () => {
    try {
        const query = `
        query {
            getPickers {
            id
            name
            }
        }
        `;

        const response = await api.post('', { query });
        return response.data.data.getPickers;
    } catch (error) {
        console.error('Error al obtener los pickers:', error);
        return [];
    }
    };
