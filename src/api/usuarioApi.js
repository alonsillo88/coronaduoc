import api from './api';

// Obtener todos los usuarios
export const getAllUsuarios = async (token) => {
    const query = `
        query findAllUsers {
            findAllUsers {
                email
                firstName
                lastName
                roles
                idSucursal
                estado
            }
        }
    `;

    try {
        const response = await api.post('', { query }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data.data.findAllUsers;
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        return [];
    }
};

// Crear un usuario
export const createUsuario = async (token, userData) => {
    const mutation = `
        mutation createUser($createUserInput: CreateUserInput!) {
            createUser(createUserInput: $createUserInput) {
                email
                firstName
                lastName
                roles
                idSucursal
                estado
            }
        }
    `;

    try {
        const response = await api.post('', {
            query: mutation,
            variables: {
                createUserInput: userData
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        console.log("Respuesta completa del servidor:", response);
        return response.data.data.createUser;
    } catch (error) {
        console.error('Error creando usuario:', error);
        return null;
    }
};


// Actualizar un usuario
export const updateUsuario = async (token, userData) => {
    const mutation = `
        mutation updateUser($updateUserInput: UpdateUserInput!) {
            updateUser(updateUserInput: $updateUserInput) {
                email
                firstName
                lastName
                roles
                idSucursal
                estado
            }
        }
    `;

    try {
        const response = await api.post('', {
            query: mutation,
            variables: {
                updateUserInput: userData
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log(response);
        return response.data.data.updateUser;
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        return null;
    }
};

// Actualizar contraseña de un usuario
export const updatePassword = async (token, email, newPassword) => {
    const mutation = `
        mutation updateUserPassword($email: String!, $newPassword: String!) {
            updateUserPassword(email: $email, newPassword: $newPassword) {
                email
            }
        }
    `;

    try {
        const response = await api.post('', {
            query: mutation,
            variables: {
                email: email,
                newPassword: newPassword
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data.data.updateUserPassword;
    } catch (error) {
        console.error('Error actualizando contraseña del usuario:', error);
        return null;
    }
};

// Eliminar un usuario
export const removeUsuario = async (token, email) => {
    const mutation = `
        mutation removeUser($email: String!) {
            removeUser(email: $email)
        }
    `;

    try {
        await api.post('', {
            query: mutation,
            variables: {
                email: email
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return true;
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        return false;
    }
};
