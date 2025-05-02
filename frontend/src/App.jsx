import React, { useState } from 'react'; 
import AuthForm from './components/AuthForm'; 
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Divider,
} from '@mui/material';

const App = () => {
    const [token, setToken] = useState(null); // Храним JWT токен
    const [protectedData, setProtectedData] = useState(''); // Сюда будет приходить защищённый ответ
    // Запрос к защищённому маршруту 
    
    
    const getProtected = async () => {
        try {
            const response = await axios.get('http://localhost:3000/protected', { 
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
    
            setProtectedData(JSON.stringify(response.data, null, 2));
        } catch (error) { setProtectedData(error.response?.data?.message || 'Ошибка при получении данных');
        } 
    };
        
    // Выход: удаляем токен
    const handleLogout = () => {
        setToken(null);
        setProtectedData('');
    };
    return (
        
        <Container maxWidth="sm" sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                JWT Аутентификация
            </Typography>
            <AuthForm setToken={setToken} />
            
            {token && (
                <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                    <Typography variant="subtitle1">Токен:</Typography> 
                    <Box

                        sx={{
                            backgroundColor: '#f5f5f5', 
                            wordBreak: 'break-all', 
                            padding: 1,
                            marginTop: 1,
                            fontSize: '0.8rem', 
                            borderRadius: 1,
                        }} 
                    >
                        {token}
                    </Box>
                    <Divider sx={{ marginY: 2 }} />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}> 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={getProtected}
                        >
                            Получить защищённые данные
                        </Button>
  
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
                        >
                            Выйти
                        </Button>
                    </Box>
                    {protectedData && (
                        <Box
                            component="pre"
                            sx={{
                                backgroundColor: '#fafafa', 
                                marginTop: 2,
                                padding: 2,
                                borderRadius: 1,
                                overflowX: 'auto',
                            }}
                        >
                            {protectedData}
                        </Box>
                    )}
                </Paper> 
            )}
        </Container>
    );
};

export default App;


