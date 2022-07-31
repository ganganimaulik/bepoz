import { ICompany, IUser } from "@models/user-model";
import userRepo from "@repos/user-repo";

class Checkout {
  companies: ICompany[];
  user: IUser;
  offerApplied: string;

  constructor(pricingRules: ICompany[], user: IUser) {
    this.companies = pricingRules;
    this.user = user;
    this.offerApplied = "";
  }

  checkout(): { total: number; offerApplied: string } {
    let total = 0;
    this.offerApplied = "none";

    // get user's company
    let company = this.companies.find(
      (c) => c.name === this.user.company
    ) as ICompany;
    console.log(this.user.cart);
    this.user.cart?.forEach((item) => {
      if (
        company?.offer?.type === "free" ||
        !company?.offer?.type ||
        !company
      ) {
        this.offerApplied = "none";
        total += +item.price * +item.quantity;
      } else if (company.offer?.type === "discount") {
        if (item.size === company.offer.on) {
          this.offerApplied = company.offer.name;
          total += +(company.offer.price as number) * +item.quantity;
        } else {
          total += +item.price * +item.quantity;
        }
      }
    });
    if (company?.offer?.type === "free") {
      let cartItemOnOffer = this.user.cart?.find(
        (item) => item.size === company.offer.on
      );
      if (
        cartItemOnOffer &&
        +cartItemOnOffer.quantity >= +(company.offer.buy as number)
      ) {
        this.offerApplied = company.offer.name;

        total -=
          +cartItemOnOffer.price *
          (+(company.offer.get as number) - +(company.offer.buy as number));
      }
    }

    return { total, offerApplied: this.offerApplied };
  }
}

export default Checkout;
