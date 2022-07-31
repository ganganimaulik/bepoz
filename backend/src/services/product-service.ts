import productRepo from "@repos/product-repo";
import { IProduct } from "@models/product-model";

/**
 * Get all products.
 *
 * @returns
 */
function getAll(): Promise<IProduct[]> {
  return productRepo.getAll();
}

// Export default
export default {
  getAll,
} as const;
