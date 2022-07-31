 import { ICompany } from "@models/user-model";
import orm from "./mock-orm";

/**
 * Get all companies.
 *
 * @returns
 */
async function getAll(): Promise<ICompany[]> {
  const db = await orm.openDb();
  return db.companies as ICompany[];
}

// Export default
export default {
  getAll,
} as const;
