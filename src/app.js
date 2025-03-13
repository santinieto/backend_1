import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import connectMongoDB from "./db/db.js";
import appRouter from "./routes/app.router.js";
import errorHandler from "./middlewares/error_handler.mid.js";
import ProductsManager from "./products_manager/products_manager.js";
import session from "express-session";

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json()); // Middleware para parsear JSON en el body de las requests
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios en el body de las requests
app.use(express.static("public")); // Middleware para servir archivos estáticos

// Configuracion de sesiones
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true, // true: siempre activa, false: muerte por inactividad
        saveUninitialized: true, // true: guarda cualquier cosa, false: no guarda sesiones vacias
        cookie: {
            maxAge: 1000 * 60 * 60 * 7, // 1 semana
        },
    })
);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Endpoints
app.use("/", appRouter);

// Manejo de errores
app.use(errorHandler);

// Websockets
io.on("connection", (socket) => {
    const productsManager = new ProductsManager();

    // Logeo las conexiones
    console.log("Nuevo cliente conectado! >>>", socket.id);

    // Cuando un usuario nuevo se conecta, le paso la lista de productos
    socket.on("new user", async () => {
        // Convertir manualmente a objetos planos
        const { products, err } = await productsManager.getProducts();
        if (err) {
            console.log(err.message);
        }

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

const serverReady = () => {
    console.log(
        `Servicio iniciado en el puerto ${PORT}... http://localhost:${PORT}`
    );

    // Conexion con MongoDB
    connectMongoDB();
};

// Ojo aca que habia puesto app.listen()
server.listen(PORT, serverReady);
