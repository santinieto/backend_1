import fs from "fs";

class CartsManager {
    constructor(pathFile) {
        this.carts = []; // Array para almacenar los carritos
        this.pathFile = pathFile; // Ruta del archivo
        this.nextID = 0; // Control del próximo ID
    }

    // Cargar carritos desde el archivo
    loadCarts = async () => {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
            this.carts = JSON.parse(fileData);

            // Obtener el próximo ID basado en los carritos existentes
            this.nextID = this.carts.reduce((max, cart) => {
                return cart.id > max ? cart.id : max;
            }, 0) + 1;

            console.log("Carritos cargados correctamente...");
        } catch (error) {
            console.error("Error cargando los datos, inicializando carritos como un array vacío:", error);
            this.carts = [];
        }
    };

    // Guardar los carritos en el archivo
    async saveCarts() {
        try {
            const data = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.pathFile, data, "utf-8");
            console.log("Carritos guardados correctamente...");
        } catch (error) {
            console.error("Error al guardar los carritos:", error);
        }
    };

    // Obtener todos los carritos
    async getCarts() {
        return this.carts;
    }

    // Obtener un carrito por ID
    async getCartById(id) {
        const cart = this.carts.find(cart => cart.id == parseInt(id, 10));
        if (!cart) {
            return { cart: null, err: `Carrito con ID ${id} no encontrado.` };
        }
        return { cart: cart, err: null };
    }

    // Agregar un nuevo carrito
    async createCart(cart) {
        const newCart = {
            id: this.nextID++,
            products: cart.products || [] // Inicializar con un array de productos vacío si no se pasa ninguno
        };
        this.carts.push(newCart);
        await this.saveCarts();
        console.log(`Carrito con ID ${newCart.id} agregado correctamente.`);
        return newCart;
    }

    // Agregar un producto a un carrito
    async addProductToCart(cartId, productId) {
        const { cart, err } = await this.getCartById(cartId);
        if (err) {
            return { product: {}, err: err};
        }

        // Buscar si el producto ya existe en el carrito
        let product
        const existingProduct = cart.products.find(p => p.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1; // Incrementar la cantidad si ya existe
            product = existingProduct;
        } else {
            product = {
                id: productId,
                quantity: 1
            }
            cart.products.push(product); // Agregar un nuevo producto
        }

        await this.saveCarts();
        console.log(`Producto con ID ${productId} agregado al carrito ${cartId}.`);
        
        return { product: product, err: null };
    }

    // Eliminar un carrito por ID
    async deleteCart(cartId) {
        let errMsg;
        const initialLength = this.carts.length;
        this.carts = this.carts.filter(cart => cart.id !== parseInt(cartId, 10));
        if (this.carts.length === initialLength) {
            errMsg = `Carrito con ID ${cartId} no encontrado.`
            console.error(errMsg);
            return errMsg;
        } else {
            await this.saveCarts();
            console.log(`Carrito con ID ${cartId} eliminado correctamente.`);
            return null
        }
    }
}

export default CartsManager;

// // Ejemplo de uso
// const main = async () => {
//     const cartsManager = new CartsManager("./carts.json");

//     // Cargar los carritos
//     await cartsManager.loadCarts();

//     // Agregar un nuevo carrito
//     const newCart = await cartsManager.addCart({});

//     // Agregar productos al carrito
//     await cartsManager.addProductToCart(newCart.id, { id: 1, name: "Producto A", quantity: 2 });
//     await cartsManager.addProductToCart(newCart.id, { id: 2, name: "Producto B", quantity: 1 });

//     // Obtener todos los carritos
//     console.log("Carritos actuales:", cartsManager.getCarts());

//     // Eliminar un carrito
//     await cartsManager.deleteCart(newCart.id);
// };

// main();
