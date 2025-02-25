import express from "express";
import ProductsManager from "..//products_manager/products_manager.js";
import __dirname from "../utils/dirname.js";

const viewsRouter = express.Router();
const productsManager = new ProductsManager();

// Ruta raiz
viewsRouter.get("/", async (req, res) => {
    const response = await productsManager.getProducts();

    // Convertir manualmente a objetos planos
    const products = response.map((product) => product.toObject());

    res.render("home", { products });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

export default viewsRouter;
