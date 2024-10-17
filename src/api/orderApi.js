import api from './api';

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

        if (response.status !== 200) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        if (response.data.errors) {
            console.error('Errores en la respuesta:', response.data.errors);
            throw new Error('Error en la respuesta de la API GraphQL');
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

    const response = await api.post('', {
        query: mutation,
        variables,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log(response);
    return response.data.data.assignOrders;
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
