const fs = require('fs'); 
require('dotenv').config(); // Подключаем dotenv
const jwt = require('jsonwebtoken'); // Подключаем JWT

const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');


const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', // Укажите адрес вашего фронтенда
    methods: ['GET', 'POST'],
    credentials: true
}));

let users = []; // Простая "база данных" в оперативной памяти

app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET;


// Middleware для проверки JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Получаем токен из заголовка Authorization: Bearer <token>
    
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => { 
        if (err) {
            return res.status(403).json({ message: 'Невалидный токен' });
        }
        req.user = user; // Сохраняем расшифрованные данные в запрос
        next(); // Продолжаем выполнение маршрута 
    });
}

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API для управления задачами',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['openapi.yaml'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
let products = [];

try {
    const data = fs.readFileSync('./products.json', 'utf8');
    products = JSON.parse(data);
} catch (err) {
    console.error('Ошибка чтения файла products.json:', err);
}

function saveProductsToFile() {
    try {
        const data = JSON.stringify(products, null, 2);
        fs.writeFileSync('./products.json', data);
    } catch (err) {
        console.error('Ошибка записи в файл products.json:', err);
    }
}

app.get('/products', (req, res) => {
    res.json(products);
});


app.post("/products", (req, res) => {
    const { name, price, description, categories } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "Название и цена обязательны" });
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        description: description || "Описание отсутствует",
        categories: Array.isArray(categories) ? categories : []
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, description, categories } = req.body;

    const productIndex = products.findIndex(p => p.id == id);
    if (productIndex === -1) {
        return res.status(404).json({ error: "Товар не найден" });
    }

    products[productIndex] = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        price: price || products[productIndex].price,
        description: description || products[productIndex].description,
        categories: Array.isArray(categories) ? categories : products[productIndex].categories
    };

    res.json(products[productIndex]);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products = products.filter(p => p.id !== productId);
    saveProductsToFile(); 
    res.status(200).json({ message: 'Product deleted successfully' });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join('/Users/neliakiasova/ProjectForStudy/frontBack/56/backend/admin.html'));
});



app.post('/register', (req, res) => { 
    const { username, password } = req.body; 
    // Проверка: существует ли пользователь с таким именем
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }
    // Создание нового пользователя 
    const newUser = {
        id: users.length + 1,
        username,
        password // !!! Пароль сохраняется как есть (без шифрования)
    };
    
    // Добавление пользователя в массив 
    users.push(newUser);

     // Ответ клиенту
    res.status(201).json({ message: 'Регистрация прошла успешно' });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
         
    // Поиск пользователя
    const user = users.find(user => user.username === username && user.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Неверные имя пользователя или пароль' }); 
    }
    
    // Создание JWT токена
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
         
    // Ответ клиенту
    res.json({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'Доступ к защищённым данным получен!', 
        user: req.user // Показываем данные, извлечённые из токена 
    });
});

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:", PORT);
});
