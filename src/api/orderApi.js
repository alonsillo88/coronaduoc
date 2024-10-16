import api from './api';

// Obtener órdenes de la tienda
export const getOrdersForStore = async (token, idSucursal) => {
    try {
        const query = `
        query getOrders($filter: OrderFilterInput!) {
            getOrders(filter: $filter) {
                externalOrderId
                    customer {
                    firstName
                    lastName
                }
                origin {
                    facilityId
                    facilityName
                    address {
                        state
                    }
                }
                logisticsInfo {
                    deliveryType
                }
                orderStatus
            }
        }
        `;

        const response = await api.post('', {
            query,
            variables: {
                filter:{
                    facilityId: idSucursal.toString(),  
                    orderStatus: "approved"
                }
                
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log(response);
        return response.data.data.getOrders;
    } catch (error) {
        console.error('Error al obtener las órdenes de la tienda:', error);
        return [];
    }
};

// Obtener pickers disponibles para la tienda
export const getPickersBySucursal = async (token, idSucursal) => {
    try {
        const query = `
        query getPickersBySucursal($idSucursal: String!) {
            getPickersBySucursal(idSucursal: $idSucursal) {
                firstName
                lastName
                email
                roles
            }
        }
        `;
        const response = await api.post('', {
            query,
            variables: {
                idSucursal: idSucursal.toString()
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data.data.getPickersBySucursal;
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
