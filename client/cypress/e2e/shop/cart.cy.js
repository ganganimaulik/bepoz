/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("test cart application", () => {
  it("displays all 4 users in selectUser", () => {
    cy.request("http://localhost:3000/api/users/reset-database");
    cy.visit("http://localhost:3005/");

    http: cy.get(".user-select option").should("have.length", 4);

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    cy.get(".user-select option").first().should("have.value", "1");
    cy.get(".user-select option").last().should("have.value", "4");
  });

  it(`Case #1 - Customer: default
        Items:
        Small Pizza x1
        Medium Pizza x1
        Large Pizza x1
        Output: Total $49.97.`, () => {
    cy.visit("http://localhost:3005/");

    cy.get(".user-select").select(`4`);
    cy.get(".product-small .add-btn").click();
    cy.get(".product-medium .add-btn").click();
    cy.get(".product-large .add-btn").click();

    cy.get(".offer-applied").contains("offer applied: none");
    cy.get(".cart-total").contains("Total: $49.97");
  });

  it(`Case #2
        Customer: Microsoft
        Items:
         Small Pizza x3
         Large Pizza x1
        Output: Total $45.97`, () => {
    cy.visit("http://localhost:3005/");

    cy.get(".user-select").select(`1`);
    cy.get(".product-small .add-btn").click();
    cy.get(".product-small .add-btn").click();
    cy.get(".product-small .add-btn").click();
    cy.get(".product-large .add-btn").click();

    cy.get(".offer-applied").contains("offer applied: 3 for 2");
    cy.get(".cart-total").contains("Total: $45.97");
  });
  it(`Case #3
      Customer: Amazon
      Items:
        Medium Pizza x3
        Large Pizza x1
      Product Checkout 3
      Output: Total $67.96.`, () => {
    cy.visit("http://localhost:3005/");

    cy.get(".user-select").select(`2`);
    cy.get(".product-medium .add-btn").click();
    cy.get(".product-medium .add-btn").click();
    cy.get(".product-medium .add-btn").click();
    cy.get(".product-large .add-btn").click();

    cy.get(".offer-applied").contains("offer applied: discount on large pizza");
    cy.get(".cart-total").contains("Total: $67.96");
  });
  it("reset cart for all users", () => {
    cy.request("http://localhost:3000/api/users/reset-database");
  });
});
