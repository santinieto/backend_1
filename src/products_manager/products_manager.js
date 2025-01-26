import fs from "fs";

class ProductsManager {
    constructor(pathFile) {
        this.products = [];
        this.pathFile = pathFile;
        this.nextID = 0;
    }

    loadProducts = async () => {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
            this.products = JSON.parse(fileData);

            // Actualiza el siguiente ID basándose en el producto con el ID más alto
            this.nextID = this.products.reduce(
                (max, product) => Math.max(max, product.id),
                0
            );

            console.log("Datos de productos cargados correctamente.");
        } catch (error) {
            console.error(
                "Error al cargar los datos, inicializando productos como un array vacío:",
                error.message
            );
            this.products = [];
        }
    };

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(product => product.id == parseInt(id, 10));
        if (!product) {
            console.error(`Producto con ID ${id} no encontrado.`);
            return { product: null, err: `Producto con ID ${id} no encontrado.` };
        }
        return { product: product, err: null };
    }

    async addProduct(product) {
        const newProduct = {
            id: ++this.nextID,
            ...product,
        };
        this.products.push(newProduct);
        await this.saveProducts();
        console.log(`Producto con ID ${newProduct.id} agregado correctamente.`);
        return newProduct
    }

    async updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((p) => p.id == id);
        if (index === -1) {
            console.error(`Producto con ID ${id} no encontrado.`);
            return {updatedProduct: null, err: `Producto con ID ${id} no encontrado.`};
        }

        this.products[index] = { ...this.products[index], ...updatedProduct };
        await this.saveProducts();
        console.log(`Producto con ID ${id} actualizado correctamente.`);
        return {updatedProduct: this.products[index], err: null};
    }

    async deleteProduct(id) {
        let deleted = false;
        const initialLength = this.products.length;
        this.products = this.products.filter((product) => product.id !== parseInt(id, 10));

        if (this.products.length === initialLength) {
            console.error(`Producto con ID ${id} no encontrado.`);
        } else {
            await this.saveProducts();
            deleted = true;
            console.log(`Producto con ID ${id} eliminado correctamente.`);
        }
        
        return deleted
    }

    async saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.pathFile, data, "utf-8");
            console.log("Productos guardados correctamente.");
        } catch (error) {
            console.error("Error al guardar los productos:", error.message);
        }
    }
}

export default ProductsManager;

// Ejemplo de uso
const main = async () => {
    const productsManager = new ProductsManager("./products.json");

    // Espera a que los productos se carguen
    await productsManager.loadProducts();

    // Obtener todos los productos
    console.log("Todos los productos:", productsManager.getProducts());

    // Agregar un producto
    await productsManager.addProduct({
        name: "Remera manga corta",
        price: 17000,
        discount: 25.0,
        category: "Ropa",
        description: "Remera de verano",
        image: "image-1.jpg",
        stock: 30,
        code: "REM-001",
    });

    // Obtener un producto por ID
    console.log("Producto con ID 1:", productsManager.getProductById(1));

    // Actualizar un producto
    await productsManager.updateProduct(1, { price: 18000 });

    // Eliminar un producto
    await productsManager.deleteProduct(2);
};

// main().catch((error) => {
//     console.error("Error en la ejecución del ejemplo:", error.message);
// });
