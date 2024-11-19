import api from './api';

// Manejar autenticación expirada
const handleUnauthenticated = (errors) => {
    if (errors && errors.some(error => error.code === 'UNAUTHENTICATED')) {
        // Redirigir al login si el token ha caducado
        window.location.href = '/login';
        return true;
    }
    return false;
};

// Obtener órdenes de la tienda
export const getOrdersForStore = async (token, idSucursal) => {
    try {
        const query = `
            query getOrders($filter: OrderFilterInput!) {
                getOrders(filter: $filter) {
                    externalOrderId
                    cancelReason
                    creationDate
                    customer {
                        firstName
                        lastName
                        documentType
                        document
                        documentVerifyDigit
                        email
                        phone
                    }
                    destination {
                        facilityId
                        facilityName
                        address {
                            state
                            community
                            city
                            street
                            number
                            complement
                            postalCode
                            contact {
                                firstName
                                lastName
                                documentType
                                document
                                phone
                                email
                            }
                        }
                    }
                    externalDate
                    externalSequenceNumber
                    history {
                        system
                        creationDate
                        attributes {
                            dataType
                            field
                            oldValue
                            newValue
                        }
                    }
                    items {
                        lineNumber
                        productId
                        status
                        statusDescription
                        categoryId
                        categoryDescription
                        subCategoryId
                        subCategoryDescription
                        classId
                        classDescription
                        sku
                        skuVerifyDigit
                        externalSku
                        skuName
                        skuDescShort
                        color
                        size
                        quantity
                        price
                        discount
                        currencyCode
                        imageUrl
                        total
                        isGift
                        quantityConfirmedBackstore
                        breakReason
                    }
                    lastChangeDate
                    logisticsInfo {
                        deliveryType
                        deliveryOptions
                        methodShippingCode
                        methodShippingDescription
                        estimateShipping
                        priceShipping
                    }
                    orderStatus
                    orderStatusDescription
                    origin {
                        facilityId
                        facilityName
                        address {
                            city
                            state
                            street
                            number
                            postalCode
                        }
                    }
                    payment {
                        code
                        codeDescription
                        name
                        installmentsNumber
                        installmentsValue
                        value
                    }
                    shipValue
                    source
                    subTotalValue
                    taxValue
                    totalValue
                    assignment {
                        assignedTo
                        assignedBy
                        assignmentDate
                    }
                    orderBackstoreStatus
                }
            }
        `;

        const response = await api.post('', {
            query,
            variables: {
                filter: {
                    facilityId: idSucursal.toString(),
                    orderStatus: "approved"
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return [];
        }

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

        console.log('Enviando solicitud GraphQL:', {
            query,
            variables: {
                idSucursal: idSucursal.toString(),
            },
        });

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

        if (handleUnauthenticated(response.data.errors)) {
            return [];
        }

        return response.data.data.getPickersBySucursal;
    } catch (error) {
        if (error.response) {
            console.error('Error en la respuesta del servidor:', error.response.data);
        } else {
            console.error('Error al obtener los pickers:', error.message);
        }
        return [];
    }
};

// Asignar órdenes a un picker
export const assignOrdersToPicker = async (token, pickerEmail, orderIds, assignedBy) => {
    const mutation = `
    mutation assignOrders($input: AssignOrdersInput!) {
        assignOrders(input: $input) {
            externalOrderId
            assignment {
                assignedTo
                assignedBy
                assignmentDate
            }
        }
    }
  `;

    const variables = {
        input: {
            orderIds,
            pickerEmail,
            assignedBy,
        }
    };

    try {
        const response = await api.post('', {
            query: mutation,
            variables,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        return response.data.data.assignOrders;
    } catch (error) {
        console.error('Error al asignar órdenes:', error);
        return null;
    }
};

// Obtener órdenes asignadas a un picker
export const getOrdersForPicker = async (token, pickerEmail) => {
    try {
        if (!token) {
            console.error('Error: El token de autenticación no está presente.');
            return [];
        }

        const query = `
            query getOrders($filter: OrderFilterInput!) {
                getOrders(filter: $filter) {
                    externalOrderId
                    creationDate
                    items {
                        productId
                        skuName
                        quantity
                        quantityConfirmedBackstore
                        breakReason
                        imageUrl
                        ean
                        color
                        size
                    }
                    orderBackstoreStatus
                    assignment {
                        assignedTo
                        assignmentDate
                    }
                    externalDate
                }
            }
        `;

        const response = await api.post('', {
            query,
            variables: {
                filter: {
                    assignedTo: pickerEmail,
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return [];
        }

        console.log('Response completa del backend:', response);

        if (response.data && response.data.data) {
            return response.data.data.getOrders;
        } else {
            console.error('Error: La propiedad `data` o `data.data` no está presente en la respuesta.');
            if (response.data && response.data.errors) {
                console.error('Errores en la respuesta:', response.data.errors);
            }
            return [];
        }
    } catch (error) {
        console.error('Error al obtener las órdenes del picker:', error);
        return [];
    }
};

// Actualizar una orden desde el picker
export const updateOrderForPicking = async (token, updateOrderInput) => {
    console.log(updateOrderInput);
    const mutation = `
    mutation updateOrderForPicking($updateOrderInput: UpdateOrderInput!) {
        updateOrderForPicking(updateOrderInput: $updateOrderInput) {
            externalOrderId
            creationDate
            items {
                productId
                skuName
                quantity
                quantityConfirmedBackstore
                breakReason
                imageUrl
                ean
                color
                size
            }
            orderBackstoreStatus
            orderBackstoreStatusDate
            assignment {
                assignedTo
                assignmentDate
            }
            externalDate
        }
    }
`;

    const variables = {
        updateOrderInput
    };

    try {
        console.log('Enviando la siguiente mutación a la API:', mutation);
        console.log('Con las siguientes variables:', variables);

        const response = await api.post('', {
            query: mutation,
            variables,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        console.log('Respuesta completa del backend:', response);

        if (response.data && response.data.data) {
            return response.data.data.updateOrderForPicking;
        } else {
            console.error('Error: La propiedad `data` o `data.data` no está presente en la respuesta.');
            if (response.data && response.data.errors) {
                console.error('Errores en la respuesta:', response.data.errors);
            }
            return null;
        }

    } catch (error) {
        console.error('Error al actualizar la orden:', error);
        return null;
    }
};


// Obtener órdenes de transporte (Coordinación SFS)
export const getTransportOrders = async (token) => {
    try {
        const query = `
            query getTransportOrders {
                getTransportOrders {
                    id
                    customer {
                        firstName
                        lastName
                    }
                    shippingAddress {
                        street
                        number
                        city
                        state
                        postalCode
                    }
                    status
                }
            }
        `;

        const response = await api.post('', {
            query,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return [];
        }

        return response.data.data.getTransportOrders;
    } catch (error) {
        console.error('Error al obtener las órdenes de transporte:', error);
        return [];
    }
};

// Actualizar estado de una orden de transporte
export const updateTransportOrderStatus = async (token, orderId, status) => {
    try {
        const mutation = `
            mutation updateTransportOrderStatus($input: UpdateTransportOrderInput!) {
                updateTransportOrderStatus(input: $input) {
                    id
                    status
                }
            }
        `;

        const variables = {
            input: {
                id: orderId,
                status: status
            }
        };

        const response = await api.post('', {
            query: mutation,
            variables,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        return response.data.data.updateTransportOrderStatus;
    } catch (error) {
        console.error('Error al actualizar el estado de la orden de transporte:', error);
        return null;
    }
};

// Obtener órdenes C&C para la sucursal asignada
export const getCCOrders = async (token, idSucursal) => {
    try {
        const query = `
            query getOrders($filter: OrderFilterInput!) {
                getOrders(filter: $filter) {
                    externalOrderId
                    orderBackstoreStatus
                    comments
                    customer {
                        firstName
                        lastName
                        document
                        documentVerifyDigit
                        email
                        phone
                    }
                    items {
                        skuName
                        quantity
                    }
                }
            }
        `;

        const response = await api.post('', {
            query,
            variables: {
                filter: {
                    facilityId: idSucursal.toString(),
                    deliveryType: "pickup",
                    orderBackstoreStatus: "Confirmada"
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return [];
        }

        return response.data.data.getOrders;
    } catch (error) {
        console.error('Error al obtener las órdenes C&C:', error);
        return [];
    }
};

// Actualizar el estado de una orden C&C
export const updateCCOrderStatus = async (token, updateCCOrderInput) => {
    const mutation = `
        mutation updateCCOrderStatus($updateCCOrderInput: UpdateCCOrderInput!) {
            updateCCOrderStatus(updateCCOrderInput: $updateCCOrderInput) {
                externalOrderId
                orderBackstoreStatus
                comments
            }
        }
    `;

    const variables = {
        updateCCOrderInput
    };

    try {
        const response = await api.post('', {
            query: mutation,
            variables,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (handleUnauthenticated(response.data.errors)) {
            return null;
        }

        return response.data.data.updateCCOrderStatus;
    } catch (error) {
        console.error('Error al actualizar el estado de la orden C&C:', error);
        return null;
    }
};



