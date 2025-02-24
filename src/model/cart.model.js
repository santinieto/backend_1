import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    created_at: { type: Date, default: Date.now() },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
