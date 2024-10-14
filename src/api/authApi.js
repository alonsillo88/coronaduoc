import api from './api';

export const login = async (email, password) => {
    const query = `
        mutation login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
                accessToken
                firstName
                lastName
                email
                roles 
                idSucursal
            }
        }
    `;

    try {
        const response = await api.post('', {
            query,
            variables: {
                loginInput: {
                    email,
                    password,
                },
            },
        });

        const loginData = response.data.data?.login;

        if (loginData) {
            const token = loginData.accessToken;
            const rolesUsuario = loginData.roles;
            const nombreUsuario = loginData.firstName;
            const apellidoUsuario = loginData.lastName;
            const emailUsuario = loginData.email;
            const idSucursal = loginData.idSucursal;

            // Almacenar datos en el localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('rolesUsuario', JSON.stringify(rolesUsuario));
            localStorage.setItem('nombreUsuario', nombreUsuario);
            localStorage.setItem('apellidoUsuario', apellidoUsuario);
            localStorage.setItem('emailUsuario', emailUsuario);
            localStorage.setItem('idSucursal', idSucursal);

            return loginData;
        } else {
            throw new Error('Credenciales inválidas o respuesta incompleta.');
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
        throw new Error('Error al intentar iniciar sesión.');
    }
};

export const logout = () => {
    console.log('authApi.js : Iniciando el proceso de logout...');
    console.log('authApi.js : Estado del localStorage antes de limpiar:', { ...localStorage });
    
    localStorage.clear();  // Limpiamos el almacenamiento local
    
    console.log('authApi.js : Estado del localStorage después de limpiar:', { ...localStorage });
    console.log('authApi.js : Redirigiendo al login...');
    
    window.location.href = '/login'; // Redirigir al login
};
