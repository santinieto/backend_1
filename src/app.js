import express from 'express';
import { engine } from "express-handlebars"
import { createServer } from 'http';
import { Server } from 'socket.io';
import productsRouter from './routes/products.rounter.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductsManager from "./products_manager/products_manager.js";
import path from "path";
import __dirname from "./utils/dirname.js";

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

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

// Lista de productos
const products = []

// Websockets
io.on('connection', (socket) => {
    // Logeo las conexiones
    console.log('Nuevo cliente conectado! >>>', socket.id);
    
    // Cuando un usuario nuevo se conecta, le paso la lista de productos
    socket.on("new user", async () => {
        const productsManager = new ProductsManager(path.join(__dirname, "/public/data/products.json"));
        await productsManager.loadProducts();
        const products = await productsManager.getProducts();
        
        // Le mando la historia de mensajes al nuevo cliente
        socket.emit('products history', products)
    })
    
    // Logeo las desconexiones
    socket.on('disconnect', () => {
        console.log('Usuario desconectado <<<', socket.id);
    });
})

server.listen(PORT, () => { // Ojo aca que habia puesto app.listen()
    console.log(`Servicio iniciado en el puerto ${PORT}... http://localhost:${PORT}`);
});