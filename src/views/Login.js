import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    CssBaseline,
    CircularProgress,
} from '@mui/material';
import { login } from '../api/authApi'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Al entrar a la pantalla de login, limpiar el almacenamiento local para eliminar cualquier dato de sesión previa
        localStorage.clear();
        setIsAuthenticated(false);
    }, [setIsAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loginData = await login(email, password);

            if (loginData && loginData.accessToken) {
                // Guardar datos del usuario en el localStorage
                localStorage.setItem('token', loginData.accessToken);
                localStorage.setItem('nombreUsuario', loginData.firstName);
                localStorage.setItem('apellidoUsuario', loginData.lastName);
                localStorage.setItem('emailUsuario', email);
                localStorage.setItem('rolesUsuario', JSON.stringify(loginData.roles));
                localStorage.setItem('idSucursal', loginData.idSucursal);
                setIsAuthenticated(true);
                
                navigate('/home', { replace: true });
            } else {
                setError('Error en la autenticación.');
            }
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError('Credenciales inválidas. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src="/images/backstore.png" alt="Logo de Corona" style={{ width: '350px', marginBottom: '20px' }} />
                        <Typography component="h1" variant="h5">Iniciar Sesión</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Correo Electrónico"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            {error && (
                                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button 
                                className="custom-button" 
                                variant="contained" 
                                type="submit"
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        {/* Espacio reservado para otros mensajes o links */}
                    </Typography>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
