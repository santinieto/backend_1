import express from 'express';
import productsRouter from './routes/products.rounter.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
app.use(express.json()); // Middleware para parsear JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios en el body de las requests
app.use(express.static('public')); // Middleware para servir archivos estáticos

// Endpoints
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
    console.log('Servidor iniciado en http://localhost:8080');
});