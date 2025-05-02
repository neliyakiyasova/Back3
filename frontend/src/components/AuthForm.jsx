import React, { useState } from 'react'; 
import axios from 'axios';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

const AuthForm = ({ setToken }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [message, setMessage] = useState(''); 
    const [error, setError] = useState(false);

    // Сбрасываем сообщение при переключении между входом и регистрацией
    const toggleMode = () => {
        setIsRegister(!isRegister);
        setMessage(''); // Очищаем предыдущее сообщение
        setError(false);
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setMessage(''); // Очищаем сообщение перед новым запросом
        setError(false);
        
        const endpoint = isRegister ? '/register' : '/login';
        const url = `http://localhost:3000${endpoint}`;

        try {
            const response = await axios.post(url, { username, password });
            if (!isRegister) {
                const { token } = response.data; 
                setToken(token);
                setMessage('Успешный вход');
            } else {
                setMessage('Регистрация прошла успешно');
            }
        } catch (err) { 
            setMessage(err.response?.data?.message || 'Ошибка');
            setError(true);
        } 
    };
            
    return ( 
        <Box
            sx={{
                maxWidth: 400,
                margin: '2rem auto', 
                padding: '2rem',
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                backgroundColor: '#fafafa'
            }} 
        >
            <Typography variant="h5" align="center" gutterBottom>
                {isRegister ? 'Регистрация' : 'Вход'} 
            </Typography>
            {message && (
                <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
    
            <form onSubmit={handleSubmit}> 
                <TextField
                    label="Имя пользователя" 
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setMessage(''); // Очищаем сообщение при изменении поля
                    }} 
                    required
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setMessage(''); // Очищаем сообщение при изменении поля
                    }}
                    required
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    {isRegister ? 'Зарегистрироваться' : 'Войти'}
                </Button>
            </form>
            <Button
                onClick={toggleMode} // Используем новую функцию вместо setIsRegister
                fullWidth
                sx={{ mt: 1 }}
            >
                {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'} 
            </Button>
        </Box> 
    );
};

export default AuthForm;
