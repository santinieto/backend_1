import Product from "../model/product.model.js";

class ProductsManager {
    async getProducts() {
        try {
            return await Product.find();
        } catch (error) {
            console.error("Error al obtener productos:", error.message);
            return { products: [], err: "Error al obtener productos." };
        }
    }

    async getPaginatedProducts(page, limit, sort, query) {
        try {
            return await Product.paginate(
                {
                    /* No usamos filtros */
                },
                {
                    limit: limit,
                    page: page,
                    lean: true,
                }
            );
        } catch (error) {
            console.error(
                "Error al obtener productos con paginacion:",
                error.message
            );
            return { products: [], err: "Error al obtener productos." };
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find((product) => product.id == id);
            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado.`);
            }
            return { product, err: null };
        } catch (error) {
            console.error(error.message);
            return { product: null, err: error.message };
        }
    }

    async addProduct(product) {
        try {
            const newProduct = await Product.insertOne({ ...product });
            console.log(
                `Producto con ID ${newProduct.id} agregado correctamente.`
            );
            return { newProduct, err: null };
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
            return { newProduct: null, err: error.message };
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const response = await Product.updateOne(
                { _id: id },
                updatedProduct
            );
            if (response.matchedCount === 0) {
                throw new Error(`Producto con ID ${id} no encontrado.`);
            }
            console.log(`Producto con ID ${id} actualizado correctamente.`);
            return { updatedProduct: response, err: null };
        } catch (error) {
            console.error("Error al actualizar producto:", error.message);
            return { updatedProduct: null, err: error.message };
        }
    }

    async deleteProduct(id) {
        try {
            const deleted = await Product.deleteOne({ _id: id });
            if (deleted.deletedCount === 0) {
                throw new Error(`Producto con ID ${id} no encontrado.`);
            }
            console.log(`Producto con ID ${id} eliminado correctamente.`);
            return { deleted, err: null };
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            return { deleted: null, err: error.message };
        }
    }
}

export default ProductsManager;
