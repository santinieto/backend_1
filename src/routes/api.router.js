import { Router } from "express";
import productsRouter from "./products.rounter.js";
import cartsRouter from "./carts.router.js";
import usersRouter from "./users.router.js";

const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);
apiRouter.use("/users", usersRouter);

export default apiRouter;
