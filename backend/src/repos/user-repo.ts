import { IUser } from "@models/user-model";
import orm from "./mock-orm";

/**
 * Get user & cart by id.
 *
 * @param id
 * @returns
 */
async function getOne(id: number): Promise<IUser | null> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return user as IUser;
    }
  }
  return null;
}

/**
 * Get all users.
 *
 * @returns
 */
async function getAll(): Promise<IUser[]> {
  const db = await orm.openDb();
  return db.users as IUser[];
}

/**
 * check if user exist.
 *
 * @param user
 * @returns
 */
async function persists(id: number): Promise<boolean> {
  const db = await orm.openDb();
  for (const user of db.users) {
    if (user.id === id) {
      return true;
    }
  }
  return false;
}

/**
 * Update a user.
 *
 * @param user
 * @returns
 */
async function update(user: IUser): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.users.length; i++) {
    if (db.users[i].id === user.id) {
      db.users[i] = user;
      return orm.saveDb(db);
    }
  }
}

// Export default
export default {
  getOne,
  getAll,
  update,
  persists,
} as const;
