import express from "express";
import mongoose from "mongoose";
import CartsManager from "../carts_manager/carts_manager.js";
import path from "path";
import __dirname from "../utils/dirname.js";

const cartsRouter = express.Router();
const cartsManager = new CartsManager(
    path.join(__dirname, "/public/data/carts.json")
);

// Middleware para validar ObjectId de MongoDB
const validateObjectId = (req, res, next) => {
    const { cid, id } = req.params;

    if (cid && !mongoose.Types.ObjectId.isValid(cid)) {
        return res
            .status(400)
            .json({ message: "El ID del carrito no es un ObjectId válido." });
    }
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({ message: "El ID del producto no es un ObjectId válido." });
    }

    next();
};

cartsRouter.post("/create", async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({
                message: "El campo 'products' debe ser un arreglo válido.",
            });
        }

        const result = await cartsManager.createCart(products);
        if (!result || result.err) {
            return res.status(500).json({
                message: "Error al crear el carrito.",
                error: result?.err,
            });
        }

        res.status(201).json({
            message: "Carrito creado correctamente.",
            cart: result.newCart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
});

cartsRouter.get("/", async (req, res) => {
    try {
        const result = await cartsManager.getCarts();
        if (!result || result.err) {
            return res.status(500).json({
                message: "Error al obtener los carritos.",
                error: result?.err,
            });
        }

        res.status(200).json(result.carts);
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
});

cartsRouter.get("/:cid", validateObjectId, async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartsManager.getCartById(cid);

        if (!result || result.err) {
            return res.status(404).json({
                message: "Carrito no encontrado.",
                error: result?.err,
            });
        }

        res.status(200).json(result.cart);
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
});

cartsRouter.post("/:cid/products/:id", validateObjectId, async (req, res) => {
    try {
        const { cid, id } = req.params;
        const result = await cartsManager.addProductToCart(cid, id);

        if (!result || result.err) {
            return res.status(404).json({
                message: "Error al agregar el producto.",
                error: result?.err,
            });
        }

        res.status(200).json({ message: "Producto agregado correctamente." });
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
});

cartsRouter.put("/:cid", validateObjectId, async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body;

        const result = await cartsManager.updateCart(cid, products);

        if (!result || result.err) {
            return res.status(404).json({
                message: "Error al actualizar el carrito.",
                error: result?.err,
            });
        }

        res.status(200).json({
            message: "Carrito actualizado correctamente.",
            cart: result.cart,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el carrito.",
            error: error.message,
        });
    }
});

cartsRouter.delete("/:cid", validateObjectId, async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartsManager.deleteCart(cid);

        if (!result || result.err) {
            return res.status(404).json({
                message: "No se pudo eliminar el carrito.",
                error: result?.err,
            });
        }

        res.status(200).json({ message: "Carrito eliminado correctamente." });
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
});

export default cartsRouter;
