const fs = require('fs'); 
const express = require('express');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const PORT = 8080;
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let products = [];
try {
    const data = fs.readFileSync('./products.json', 'utf8');
    products = JSON.parse(data);
} catch (err) {
    console.error('Ошибка чтения файла products.json:', err);
}

const schema = buildSchema(`
    type Product {
      id: ID!
      name: String!
      price: Float!
      description: String
      categories: [String]
    }
  
    type Query {
      products: [Product]
      product(id: ID!): Product
    }
  `);
  
  const root = {
    products: () => products, 
    product: ({ id }) => products.find(p => p.id == id),
  };
  module.exports = schema 
  
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, 
  }));

  


app.get('/', (req, res) => {
    res.sendFile(path.join('/Users/neliakiasova/ProjectForStudy/frontBack/56/frontend/index.html'));
});

app.get('/2', (req, res) => {
    res.sendFile(path.join('/Users/neliakiasova/ProjectForStudy/frontBack/56/frontend/index2.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:`, PORT);
});
