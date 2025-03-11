import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
});

// Middleware para hashear la contraseña
userSchema.pre("save", function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

// Middleware para comparar contraseñas
userSchema.methods.comparePasswords = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
