import express from "express";
import CartsManager from "../carts_manager/carts_manager.js";
import ProductsManager from "../products_manager/products_manager.js";
import __dirname from "../utils/dirname.js";

const viewsRouter = express.Router();
const cartsManager = new CartsManager();
const productsManager = new ProductsManager();

// Ruta raiz
viewsRouter.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || "asc";
    const query = req.query.order || "";

    // Extraer solo los IDs de los carritos
    const results = await cartsManager.getCarts();
    if (!results || results.err) {
        return res.status(500).json({
            message: "Error al obtener los carritos.",
            error: results?.err,
        });
    }
    const cartIds = results.carts.map((cart) => cart._id);

    const products = await productsManager.getPaginatedProducts(
        page,
        limit,
        sort,
        query
    );

    res.render("home", { products, cartIds });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

viewsRouter.get("/products/:pid", async (req, res) => {
    console.log("Llamada con productId", req.params.pid);
    const { product, err } = await productsManager.getProductById(
        req.params.pid
    );

    if (err) {
        return res.status(404).json({ message: err });
    }

    res.render("product_info", { product: product });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    const { cart, err } = await cartsManager.getCartById(req.params.cid);

    if (err) {
        return res.status(404).json({ message: err });
    }

    res.render("cart_info", { cart: cart.toObject() });
});

export default viewsRouter;
