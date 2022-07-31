import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";
import jsonfile from "jsonfile";

import userService from "@services/user-service";
import { ParamMissingError } from "@shared/errors";
import userRepo from "@repos/user-repo";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
  get: "/all",
  getOne: "/:id",
  updateCart: "/update-cart",
  resetDb: '/reset-database',
  checkout: "/checkout/:id",
} as const;

/**
 * Get all users.
 */
router.get(p.get, async (_: Request, res: Response) => {
  const users = await userService.getAll();
  return res.status(OK).json({ users });
});

/**
 * reset all users cart to be empty
 */
router.get(p.resetDb, async (_: Request, res: Response) => {
  const users = await userService.resetAllUsersCart();
  return res.status(OK).json({ users });
});

/**
 * Update user cart.
 */
router.put(p.updateCart, async (req: Request, res: Response) => {
  const { user, cart } = req.body;
  // Check param
  if (!user) {
    throw new ParamMissingError();
  }

  // Fetch data
  await userService.updateCart(+user.id, cart);

  return res.status(OK).end();
});

router.get(p.checkout, async (req: Request, res: Response) => {
  const { id } = req.params;
  // Check param
  if (!id) {
    throw new ParamMissingError();
  }
  // Fetch data
  let result = await userService.checkout(+id);
  return res.status(OK).json(result);
});

router.get(p.getOne, async (req: Request, res: Response) => {
  const { id } = req.params;
  // Check param
  if (!id) {
    throw new ParamMissingError();
  }

  // Fetch data
  const user = await userRepo.getOne(+id);
  return res.status(OK).json(user);
});

// Export default
export default router;
