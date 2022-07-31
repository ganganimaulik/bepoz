import userRepo from "@repos/user-repo";
import { ICartItem, IUser } from "@models/user-model";
import { UserNotFoundError, InvalidCartError } from "@shared/errors";
import productRepo from "@repos/product-repo";
import Checkout from "@shared/Checkout";
import copmanyRepo from "@repos/copmany-repo";

/**
 * Get all users.
 *
 * @returns
 */
function getAll(): Promise<IUser[]> {
  return userRepo.getAll();
}
/**
 * Get user by id.
 *
 * @returns
 */
function getOne(id: number): Promise<IUser | null> {
  return userRepo.getOne(id) as Promise<IUser | null>;
}

/**
 * Update user cart.
 *
 * @param user
 * @returns
 */
async function updateCart(
  id: number,
  cart: ICartItem[] | undefined
): Promise<void> {
  const persists = await userRepo.persists(id);
  if (!persists) {
    throw new UserNotFoundError();
  }
  let user = (await userRepo.getOne(id)) as IUser;
  let products = await productRepo.getAll();
  // validate cart items
  if (cart) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].quantity <= 0) {
        throw new InvalidCartError();
      }
      let product = products.find((p) => p.id == cart[i].id);

      if (
        !(
          product &&
          product.price == cart[i].price &&
          product.name == cart[i].name &&
          product.size == cart[i].size
        )
      ) {
        throw new InvalidCartError();
      }
    }
  }
  user.cart = cart;
  return userRepo.update(user);
}

async function checkout(
  id: number
): Promise<{ total: number; offerApplied: string }> {
  const persists = await userRepo.persists(id);
  if (!persists) {
    throw new UserNotFoundError();
  }
  let user = (await userRepo.getOne(id)) as IUser;

  let companies = await copmanyRepo.getAll();
  let checkout = new Checkout(companies, user);

  let result = checkout.checkout();
  // clear user cart after checkout done
  // delete user.cart;
  // userRepo.update(user);
  return result;
}

async function resetAllUsersCart(): Promise<void> {
  let users = await userRepo.getAll();
  for (let i = 0; i < users.length; i++) {
    delete users[i].cart;
    await userRepo.update(users[i]);
  }
}

// Export default
export default {
  getAll,
  getOne,
  updateCart,
  checkout,
  resetAllUsersCart,
} as const;
