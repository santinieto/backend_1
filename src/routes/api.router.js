import { Router } from "express";
import productsRouter from "./products.rounter.js";
import cartsRouter from "./carts.router.js";

const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);

export default apiRouter;