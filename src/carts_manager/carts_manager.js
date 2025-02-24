import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";

class CartsManager {
    async getCarts() {
        try {
            const carts = await Cart.find();
            return { carts, err: null };
        } catch (error) {
            console.error("Error al obtener carritos:", error.message);
            return { carts: [], err: "Error al obtener carritos." };
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id);
            if (!cart) {
                return {
                    cart: null,
                    err: `Carrito con ID ${id} no encontrado.`,
                };
            }
            return { cart, err: null };
        } catch (error) {
            console.error(
                `Error al buscar el carrito con ID ${id}:`,
                error.message
            );
            return { cart: null, err: "Error al buscar el carrito." };
        }
    }

    async createCart() {
        try {
            const newCart = await Cart.create({ products: [] });
            console.log(`Carrito con ID ${newCart.id} agregado correctamente.`);
            return { newCart, err: null };
        } catch (error) {
            console.error("Error al crear carrito:", error.message);
            return { newCart: null, err: "Error al crear el carrito." };
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return { err: `Producto con ID ${productId} no encontrado.` };
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                return { err: `Carrito con ID ${cartId} no encontrado.` };
            }

            const existingProduct = cart.products.find(
                (p) => p.id.toString() === productId
            );

            if (existingProduct) {
                // Si el producto ya está en el carrito, aumentar la cantidad
                existingProduct.quantity += 1;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                cart.products.push({ id: productId, quantity: 1 });
            }

            await cart.save();
            return { err: null, cart };
        } catch (error) {
            console.error(
                "Error al agregar producto al carrito:",
                error.message
            );
            return { err: "Error al agregar producto al carrito." };
        }
    }

    async deleteCart(cartId) {
        try {
            const deleted = await Cart.updateOne(
                { _id: cartId },
                {
                    products: [],
                }
            );
            if (deleted.deletedCount === 0) {
                return {
                    deleted: null,
                    err: `Carrito con ID ${cartId} no encontrado.`,
                };
            }
            console.log(`Carrito con ID ${cartId} vaciado correctamente.`);
            return { deleted, err: null };
        } catch (error) {
            console.error("Error al vaciar el carrito:", error.message);
            return { deleted: null, err: "Error al vaciar el carrito." };
        }
    }
}

export default CartsManager;
