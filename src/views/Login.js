import React, { useState } from 'react';
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
} from '@mui/material';
import { login } from '../api/authApi'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loginData = await login(email, password);

            if (loginData && loginData.accessToken) {
                console.log('Login.js : Token guardado en localStorage:', localStorage.getItem('token'));
                setIsAuthenticated(true); // Actualiza el estado de autenticación
                navigate('/home', { replace: true });
            } else {
                setError('Error en la autenticación.');
            }
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError('Credenciales inválidas. Intenta de nuevo.');
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
                            >
                                Iniciar Sesión
                            </Button>
                        </Box>
                    </Box>
                </Paper>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        ¿No tienes cuenta? <a href="/register">Regístrate</a>
                    </Typography>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
