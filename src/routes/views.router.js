import express from "express";
import CartsManager from "../carts_manager/carts_manager.js";
import ProductsManager from "../products_manager/products_manager.js";
import __dirname from "../utils/dirname.js";

const viewsRouter = express.Router();
const cartsManager = new CartsManager();
const productsManager = new ProductsManager();

// Ruta raiz
viewsRouter.get("/", (req, res) => {
    res.render("home");
});

// Ruta de productos
viewsRouter.get("/products", async (req, res) => {
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

    res.render("products", { products, cartIds });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

viewsRouter.get("/product-info/:pid?", async (req, res) => {
    const { products, err } = await productsManager.getProducts();
    if (err) {
        return res.status(404).json({ message: err });
    }

    const productIds = products.map((product) => product._id.toString());

    // Si no se recibe un ID, usar el primer producto disponible
    const selectedId =
        req.params.pid && req.params.pid !== "?"
            ? req.params.pid
            : productIds[0];
    const selectedProduct = products.find(
        (product) => product._id.toString() === selectedId
    );

    if (!selectedProduct) {
        return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.render("product_info", {
        product: selectedProduct.toObject(),
        productIds,
    });
});

viewsRouter.get("/cart-info/:cid?", async (req, res) => {
    const { carts, err } = await cartsManager.getCarts();
    if (err) {
        return res.status(404).json({ message: err });
    }
    const cartIds = carts.map((cart) => cart._id.toString());

    // Si no se recibe un ID, usar el primer carrito disponible
    const selectedId =
        req.params.cid && req.params.cid !== "?" ? req.params.cid : cartIds[0];
    const selectedCart = carts.find(
        (cart) => cart._id.toString() === selectedId
    );
    if (!selectedCart) {
        return res.status(404).json({ message: "Carrito no encontrado." });
    }

    res.render("cart_info", { cart: selectedCart.toObject(), cartIds });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    const { carts, err } = await cartsManager.getCarts();
    if (err) {
        return res.status(404).json({ message: err });
    }

    const cartIds = carts.map((cart) => cart._id.toString());

    const selectedCart = carts.find(
        (cart) => cart._id.toString() === req.params.cid
    );

    if (!selectedCart) {
        return res.status(404).json({ message: "Carrito no encontrado." });
    }

    res.render("cart_info", { cart: selectedCart.toObject(), cartIds });
});

// Pagina de login
viewsRouter.get("/login", (req, res) => {
    res.render("login");
});

// Pagina de creacion de usuarios
viewsRouter.get("/register", (req, res) => {
    res.render("register");
});

export default viewsRouter;
