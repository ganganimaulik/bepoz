import { Router } from "express";
import userRouter from "./user-router";
import productRouter from "./product-router";

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use("/users", userRouter);
baseRouter.use("/products", productRouter);

// Export default.
export default baseRouter;
