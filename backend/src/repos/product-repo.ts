import { IProduct } from "@models/product-model";
import orm from "./mock-orm";

/**
 * Get all products.
 *
 * @returns
 */
async function getAll(): Promise<IProduct[]> {
  const db = await orm.openDb();
  return db.products as IProduct[];
}

// Export default
export default {
  getAll,
} as const;
