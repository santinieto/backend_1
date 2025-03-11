import { Router } from "express";
import User from "../model/user.model.js";

const usersRouter = Router();

usersRouter.post("/register", async (req, res) => {
    try {
        const user = req.body;
        const newUser = new User(user);

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username: newUser.username });
        if (existingUser) {
            return res.status(400).json({
                message: "El usuario ya existe.",
            });
        }

        // Validar contraseña
        if (newUser.password.length < 8) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 8 caracteres.",
            });
        }

        // Guardar usuario
        await newUser.save();

        // Devuelvo el usuario creado
        return res.status(201).json({
            message: "Usuario registrado correctamente.",
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
});

usersRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar el usuario en la base de datos
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({
                message: "Usuario no encontrado.",
            });
        }

        // Verificar la contraseña (debería estar hasheada en la base de datos)
        const isPasswordCorrect = user.comparePasswords(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Contraseña incorrecta.",
            });
        }

        // Guardo el usuario en la sesión
        req.session.user = user;

        res.status(200).json({
            message: "Usuario logueado correctamente.",
            user: user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
});

usersRouter.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            res.status(200).json({
                message: "Logout Ok!",
            });
        } else {
            res.status(500).json({
                message: `Se produjo un error: ${err.message}`,
            });
        }
    });
});

usersRouter.get("/session", (req, res) => {
    if (req.session.user) {
        res.status(200).json({
            message: "Usuario logueado.",
            user: req.session.user,
        });
    } else {
        res.status(401).json({
            message: "Usuario no logueado.",
        });
    }
});

export default usersRouter;
