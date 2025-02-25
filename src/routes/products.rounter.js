import express from "express";
import ProductsManager from "../products_manager/products_manager.js";
import mongoose from "mongoose";
import __dirname from "../utils/dirname.js";

const productsManager = new ProductsManager();
const productsRouter = express.Router();

// Middleware para manejar errores en funciones asíncronas
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware para validar ObjectId de MongoDB
const validateObjectId = (req, res, next) => {
    const { pid } = req.params;
    if (pid && !mongoose.Types.ObjectId.isValid(pid)) {
        return res
            .status(400)
            .json({ error: "El ID del producto no es un ObjectId válido." });
    }
    next();
};

productsRouter.get(
    "/",
    asyncHandler(async (req, res) => {
        const products = await productsManager.getProducts();
        res.json(products);
    })
);

productsRouter.get(
    "/:pid",
    validateObjectId,
    asyncHandler(async (req, res) => {
        const { pid } = req.params;
        const { product, err } = await productsManager.getProductById(pid);

        if (err) {
            return res.status(404).json({ message: err });
        }

        res.status(200).json(product);
    })
);

productsRouter.post(
    "/",
    asyncHandler(async (req, res) => {
        // Todos los campos son obligatorios a excepción de thumbnails
        // El ID lo genera automaticamente NoSQL
        const requiredFields = [
            "name",
            "price",
            "discount",
            "category",
            "description",
            "stock",
            "code",
            "status",
        ];

        // Verificar si todos los campos obligatorios existen en el body
        const missingFields = requiredFields.filter(
            (field) => !(field in req.body)
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Faltan campos obligatorios.",
                missingFields,
            });
        }

        const { newProduct, err } = await productsManager.addProduct(req.body);
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.status(201).json({
            message: "Producto agregado correctamente.",
            product: newProduct,
        });
    })
);

productsRouter.put(
    "/:pid",
    validateObjectId,
    asyncHandler(async (req, res) => {
        const { updatedProduct, err } = await productsManager.updateProduct(
            req.params.pid,
            req.body
        );
        if (err) {
            return res.status(404).json({ error: err });
        }
        res.status(200).json({
            message: "Producto actualizado correctamente.",
            product: updatedProduct,
        });
    })
);

productsRouter.delete(
    "/:pid",
    validateObjectId,
    asyncHandler(async (req, res) => {
        const { deleted, err } = await productsManager.deleteProduct(
            req.params.pid
        );
        if (err) {
            return res.status(404).json({ error: err });
        }
        res.json({
            message: "Producto eliminado correctamente.",
        });
    })
);

// Middleware para manejar errores globalmente
productsRouter.use((err, req, res, next) => {
    console.error("Error en el servidor:", err);
    res.status(500).json({ error: "Error interno del servidor." });
});

export default productsRouter;
