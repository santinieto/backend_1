import express from "express";
import ProductsManager from "../products_manager/products_manager.js";
import path from "path";
import __dirname from "../utils/dirname.js";

const productsManager = new ProductsManager(path.join(__dirname, "/public/data/products.json"));
await productsManager.loadProducts();

const productsRouter = express.Router();

// Endpoint GET para obtener todos los productos
productsRouter.get("/", async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos." });
    }
});

// Endpoint GET para buscar un producto por ID
productsRouter.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const { product, err } = await productsManager.getProductById(pid);

        if (err) {
            return res.status(404).json({ message: err });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error(`Error al buscar el producto con ID ${req.params.pid}:`, error);
        res.status(500).json({ error: "Error al buscar el producto." });
    }
});

// Endpoint POST para agregar un producto
productsRouter.post("/", async (req, res) => {
    try {
        const newProduct = await productsManager.addProduct(req.body);
        res.status(201).json({
            message: "Producto agregado correctamente.",
            product: newProduct,
        });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Error al agregar el producto." });
    }
});

// Endpoint PUT para actualizar un producto existente
productsRouter.put("/:pid", async (req, res) => {
    try {
        const { updatedProduct, err } = await productsManager.updateProduct(req.params.pid, req.body);
        if (err) {
            return res.status(404).json({ error: err });
        }
        res.status(200).json({
            message: "Producto actualizado correctamente.",
            product: updatedProduct,
        });
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${req.params.pid}:`, error);
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});

// Endpoint DELETE para eliminar un producto existente
productsRouter.delete("/:pid", async (req, res) => {
    try {
        const deleted = await productsManager.deleteProduct(req.params.pid);
        if (!deleted) {
            return res.status(404).json({ error: "Producto no encontrado para eliminar." });
        }
        res.json({
            message: "Producto eliminado correctamente.",
        });
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${req.params.pid}:`, error);
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
});

export default productsRouter;
