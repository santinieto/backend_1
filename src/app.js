import express from 'express';
import { engine } from "express-handlebars"
import productsRouter from './routes/products.rounter.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const PORT = 8080;

const app = express();
app.use(express.json()); // Middleware para parsear JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios en el body de las requests
app.use(express.static('public')); // Middleware para servir archivos estáticos

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Endpoints
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});