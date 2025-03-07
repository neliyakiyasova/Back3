const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());


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

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:", PORT);
});
