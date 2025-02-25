import express from "express";
import ProductsManager from "..//products_manager/products_manager.js";
import __dirname from "../utils/dirname.js";

const viewsRouter = express.Router();
const productsManager = new ProductsManager();

// Ruta raiz
viewsRouter.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order || "asc";
    const sort = req.query.sort || "category";

    const response = await productsManager.getPaginatedProducts(limit, page);

    res.render("home", { response });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

viewsRouter.get("/product/:pid", async (req, res) => {
    const { product, err } = await productsManager.getProductById(
        req.params.pid
    );

    if (err) {
        return res.status(404).json({ message: err });
    }

    res.render("product_info", { product: product.toObject() });
});

export default viewsRouter;
