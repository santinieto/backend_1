import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import __dirname from "./utils/dirname.js";
import connectMongoDB from "./db/db.js";

import productsRouter from "./routes/products.rounter.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductsManager from "./products_manager/products_manager.js";

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json()); // Middleware para parsear JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios en el body de las requests
app.use(express.static("public")); // Middleware para servir archivos estáticos

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Conexion con MongoDB
connectMongoDB();

// Endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Websockets
io.on("connection", (socket) => {
    const productsManager = new ProductsManager(
        path.join(__dirname, "/public/data/products.json")
    );

    // Logeo las conexiones
    console.log("Nuevo cliente conectado! >>>", socket.id);

    // Cuando un usuario nuevo se conecta, le paso la lista de productos
    socket.on("new user", async () => {
        // await productsManager.loadProducts();
        const response = await productsManager.getProducts();

        // Convertir manualmente a objetos planos
        const products = response.map((product) => product.toObject());

        // Le mando la historia de mensajes al nuevo cliente
        socket.emit("products history", products);

        // Le avisamos a los otros usuarios que un nuevo usuario se conecto
        socket.broadcast.emit("new user notification", socket.id);
    });

    // Agregar un producto
    socket.on("add product", async (product) => {
        await productsManager.addProduct(product);
        console.log(`Peticion de agregado de producto ${product} ejecutada.`);

        // Le avisamos a los otros usuarios que la lista de productos cambio
        const response = await productsManager.getProducts();

        // Convertir manualmente a objetos planos
        const products = response.map((product) => product.toObject());

        io.emit("products history", products);
        socket.broadcast.emit("new product", product.name);
    });

    // Borro un producto
    socket.on("delete product", async (id) => {
        await productsManager.deleteProduct(id);
        console.log(`Peticion de eliminacion de producto ${id} ejecutada.`);

        // Le avisamos a los otros usuarios que la lista de productos cambio
        const response = await productsManager.getProducts();

        // Convertir manualmente a objetos planos
        const products = response.map((product) => product.toObject());

        io.emit("products history", products);
        socket.broadcast.emit("deleted product", id);
    });

    // Logeo las desconexiones
    socket.on("disconnect", () => {
        console.log("Usuario desconectado <<<", socket.id);
    });
});

server.listen(PORT, () => {
    // Ojo aca que habia puesto app.listen()
    console.log(
        `Servicio iniciado en el puerto ${PORT}... http://localhost:${PORT}`
    );
});
