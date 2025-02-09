import express from 'express';
import ProductsManager from "..//products_manager/products_manager.js";
import path from "path";
import __dirname from "../utils/dirname.js";

const viewsRouter = express.Router();
const productsManager = new ProductsManager(path.join(__dirname, "/public/data/products.json"));

// Ruta raiz
viewsRouter.get('/', async (req, res) => {
    await productsManager.loadProducts();
    const products = await productsManager.getProducts();
    
    res.render('home', { products });
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
});

export default viewsRouter;