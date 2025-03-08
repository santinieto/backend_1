import { Router } from "express";
import viewsRouter from "./views.router.js";
import apiRouter from "./api.router.js";

const appRouter = Router();

appRouter.use("/", viewsRouter);
appRouter.use("/api", apiRouter);

export default appRouter;
