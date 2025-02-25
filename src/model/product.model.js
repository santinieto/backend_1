import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: String, required: true },
    description: { type: String, required: true },
    thumbnails: { type: String, default: "picture.png" },
    stock: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
});

// Agrego la paginacion a los productos
productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;
