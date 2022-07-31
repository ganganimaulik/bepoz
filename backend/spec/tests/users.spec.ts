import supertest from "supertest";
import StatusCodes from "http-status-codes";
import { SuperTest, Test, Response } from "supertest";
import jsonfile from "jsonfile";

import app from "@server";
import userRepo from "@repos/user-repo";
import { IUser } from "@models/user-model";
import { pErr } from "@shared/functions";
import { p as userPaths } from "@routes/user-router";
import {
  InvalidCartError,
  ParamMissingError,
  UserNotFoundError,
} from "@shared/errors";

type TReqBody = string | object | undefined;

describe("user-router", () => {
  const usersPath = "/api/users";

  const getUsersPath = `${usersPath}${userPaths.get}`;
  const updateUserCartPath = `${usersPath}${userPaths.updateCart}`;
  const checkoutPath = `${usersPath}${userPaths.checkout}`;
  const { BAD_REQUEST, CREATED, OK } = StatusCodes;
  let agent: SuperTest<Test>;
  const dbFilePath = "src/repos/database.json";
  let database = jsonfile.readFileSync(dbFilePath);
  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  afterAll((done) => {
    done();
  });

  beforeEach((done) => {
    database = jsonfile.readFileSync(dbFilePath);
    done();
  });

  afterEach((done) => {
    jsonfile.writeFileSync(dbFilePath, database);
    database = jsonfile.readFileSync(dbFilePath);

    done();
  });

  /***********************************************************************************
   *                                    Test Get USERS
   **********************************************************************************/

  describe(`"GET:${getUsersPath}"`, () => {
    it(`should return a JSON object with all the users and a status code of "${OK}" if the
            request was successful.`, (done) => {
      // Call API
      agent.get(getUsersPath).end((err: Error, res: Response) => {
        pErr(err);
        expect(res.status).toBe(OK);
        expect(res.body.users).toEqual(database.users);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });
  });

  /***********************************************************************************
   *                                    Test CART UPDATES
   **********************************************************************************/

  describe(`"PUT:${updateUserCartPath}"`, () => {
    const callApi = (reqBody: TReqBody) => {
      return agent.put(updateUserCartPath).type("form").send(reqBody);
    };
    const userData = {
      user: database.users[0],
      cart: [
        {
          ...database.products[0],
          quantity: 1,
        },
        {
          ...database.products[2],
          quantity: 2,
        },
      ],
    };

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
      // Call Api
      callApi(userData).end((err: Error, res: Response) => {
        pErr(err);
        expect(res.status).toBe(OK);
        expect(res.body.error).toBeUndefined();
        let databaseN = jsonfile.readFileSync(dbFilePath);
        for (let i = 0; i < databaseN.users[0].cart.length; i++) {
          databaseN.users[0].cart[i].quantity =
            +databaseN.users[0].cart[i].quantity;
          databaseN.users[0].cart[i].price = +databaseN.users[0].cart[i].price;
          databaseN.users[0].cart[i].id = +databaseN.users[0].cart[i].id;
        }
        expect(databaseN.users[0].cart).toEqual(userData.cart);

        done();
      });
    });

    it(`should return a JSON object with an error message of "${InvalidCartError.Msg}" and a
            status code of "${BAD_REQUEST}" if cart product quantity is invalid.`, (done) => {
      // Call Api
      let userDataN = JSON.parse(JSON.stringify(userData));
      userDataN.cart[0].quantity = -1;
      callApi(userDataN).end((err: Error, res: Response) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(InvalidCartError.Msg);

        done();
      });
    });

    it(`should return a JSON object with an error message of "${InvalidCartError.Msg}" and a
            status code of "${BAD_REQUEST}" if cart product name is invalid.`, (done) => {
      // Call Api
      let userDataN = JSON.parse(JSON.stringify(userData));

      userDataN.cart[0].name = "yoyo";
      callApi(userDataN).end((err: Error, res: Response) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.error).toBe(InvalidCartError.Msg);

        done();
      });
    });
  });

  /***********************************************************************************
   *                                   Test CHECKOUT
   **********************************************************************************/
  describe(`"GET:${checkoutPath}"`, () => {
    const callCheckoutApi = (reqBody: TReqBody) => {
      return agent.get(checkoutPath).type("form").send(reqBody);
    };
    const callAddToCartApi = (reqBody: TReqBody) => {
      return agent.put(updateUserCartPath).type("form").send(reqBody);
    };

    it(`Case #1 - Customer: default
        Items:
        Small Pizza x1
        Medium Pizza x1
        Large Pizza x1
        Output: Total $49.97.`, (done) => {
      const userData = {
        user: database.users[3],
        cart: [
          {
            ...database.products[0],
            quantity: 1,
          },
          {
            ...database.products[1],
            quantity: 1,
          },
          {
            ...database.products[2],
            quantity: 1,
          },
        ],
      };
      callAddToCartApi(userData).end((err: Error, res: Response) => {
        callCheckoutApi(userData).end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          expect(res.body.total).toBe(4997);
          expect(res.body.offerApplied).toBe("none");

          done();
        });
      });
    });

    it(`Case #2
        Customer: Microsoft
        Items:
         Small Pizza x3
         Large Pizza x1
        Output: Total $45.97`, (done) => {
      const userData = {
        user: database.users[0],
        cart: [
          {
            ...database.products[0],
            quantity: 3,
          },

          {
            ...database.products[2],
            quantity: 1,
          },
        ],
      };
      callAddToCartApi(userData).end((err: Error, res: Response) => {
        callCheckoutApi(userData).end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          expect(res.body.total).toBe(4597);
          expect(res.body.offerApplied).toBe("3 for 2");

          done();
        });
      });
    });
    
    it(`Case #3
      Customer: Amazon
      Items:
        Medium Pizza x3
        Large Pizza x1
      Product Checkout 3
      Output: Total $67.96`, (done) => {
      const userData = {
        user: database.users[1],
        cart: [
          {
            ...database.products[1],
            quantity: 3,
          },

          {
            ...database.products[2],
            quantity: 1,
          },
        ],
      };
      callAddToCartApi(userData).end((err: Error, res: Response) => {
        callCheckoutApi(userData).end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          expect(res.body.total).toBe(6796);
          expect(res.body.offerApplied).toBe("discount on large pizza");

          done();
        });
      });
    });
  });
});
