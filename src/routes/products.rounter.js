import express from "express";
import ProductsManager from "../products_manager/products_manager.js";
import path from "path";
import __dirname from "../utils/dirname.js";

const productsManager = new ProductsManager(
    path.join(__dirname, "/public/data/products.json")
);

const productsRouter = express.Router();

// Middleware para manejar errores en funciones asíncronas
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Endpoint GET para obtener todos los productos
productsRouter.get(
    "/",
    asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const order = req.query.order || "asc";
        const sort = req.query.sort || "category";

        const products = await productsManager.getProducts();
        res.json(products);
    })
);

// Endpoint GET para buscar un producto por ID
productsRouter.get(
    "/:pid",
    asyncHandler(async (req, res) => {
        const { pid } = req.params;
        const { product, err } = await productsManager.getProductById(pid);

        if (err) {
            return res.status(404).json({ message: err });
        }

        res.status(200).json(product);
    })
);

// Endpoint POST para agregar un producto
productsRouter.post(
    "/",
    asyncHandler(async (req, res) => {
        // Todos los campos son obligatorios a excepción de thumbnails
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

// Endpoint PUT para actualizar un producto existente
productsRouter.put(
    "/:pid",
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

// Endpoint DELETE para eliminar un producto existente
productsRouter.delete(
    "/:pid",
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
