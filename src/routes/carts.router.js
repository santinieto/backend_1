import express from "express";
import CartsManager from "../carts_manager/carts_manager.js";
import path from 'path';
import __dirname from '../utils/dirname.js';

const cartsRouter = express.Router();

const cartsManager = new CartsManager(path.join(__dirname, "/public/data/carts.json"));
await cartsManager.loadCarts();

cartsRouter.post("/create", async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "El campo 'products' debe ser un arreglo." });
        }

        const cart = await cartsManager.createCart({products });
        res.status(201).json({
            message: "Carrito creado correctamente.",
            cart: cart
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito.", error: error.message });
    }
});

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await cartsManager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los carritos.", error: error.message });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { cart, err } = await cartsManager.getCartById(cid);

        if (err) {
            return res.status(404).json({ message: err });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito.", error: error.message });
    }
});

cartsRouter.post("/:cid/products/:id", async (req, res) => {
    try {
        const { cid, id } = req.params;

        const { product, err } = await cartsManager.addProductToCart(cid, id);

        if (err) {
            return res.status(404).json({ message: err });
        }

        res.status(200).json({
            message: "Producto agregado correctamente.",
            product,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto al carrito.", error: error.message });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const errMsg = await cartsManager.deleteCart(cid);

        if (errMsg) {
            return res.status(404).json({ message: errMsg });
        }

        res.status(200).json({ message: "Carrito eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el carrito.", error: error.message });
    }
});

export default cartsRouter;