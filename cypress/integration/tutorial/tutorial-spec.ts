describe("Tutorial scenarios", function () {
  const username = Cypress.env("username");
  const password = Cypress.env("password");
  it("should allow to run a test and test should pass (BDD)", function () {
    expect(true).to.eq(true);
  });
  it("should use other testing approach (TDD)", function () {
    assert.isAbove(6, 1, "6 greater than 1");
  });
  it("shouldn't pass this test", function () {
    expect(1).to.be.a("string");
  });
  it.skip("should allow you to visit the website", function () {
    cy.visit("https://example.cypress.io");
    cy.contains("Kitchen Sink");
    cy.contains("h1", "Kitchen Sink");
    cy.get("div");
    cy.get("div.banner-alt");
    cy.get("div.banner-alt")
      .contains("Commands")
      .parentsUntil("div.banner-alt")
      .find("p")
      .within(($paragraph) => {
        cy.root();
        cy.contains("Commands");
      });
    cy.get(".home-list").first().contains("Querying").click();
    cy.url().should("include", "/commands/querying");
    cy.contains("h1", "Querying");
  });
  it("should allow to visit react web app", function () {
    cy.visit("http://localhost:3000");
    cy.get("[data-test=signin-username]").within(($userNameInput) => {
      cy.get("#username")
        .as("usernameInput")
        .should("be.visible")
        .and("exist")
        .and("have.attr", "value", "")
        .type(username);
      cy.get("@usernameInput").should("have.attr", "value", username);
    });
    cy.intercept("POST", "/login").as("loginReq");
    cy.getBySelector("signin-username")
      .find("#username")
      .invoke("attr", "value")
      .then((username) => {
        cy.getBySelector("signin-password").find("input").type(password);
        cy.getBySelector("signin-submit").click();
        cy.wait("@loginReq")
          .its("response")
          .then((loginResp) => {
            expect(loginResp.body.user.username).to.eq(username);
            cy.getBySelector("sidenav-username")
              .invoke("text")
              .should((sidenavUsername) => {
                expect(sidenavUsername).to.have.string(loginResp.body.user.username);
                expect(sidenavUsername).to.have.string(username);
              });
          });
      });
  });
});
