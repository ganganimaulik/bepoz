import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";

import { ParamMissingError } from "@shared/errors";
import productService from "@services/product-service";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
  get: "/all",
} as const;

/**
 * Get all products.
 */
router.get(p.get, async (_: Request, res: Response) => {
  const products = await productService.getAll();
  return res.status(OK).json({ products });
});

// Export default
export default router;
