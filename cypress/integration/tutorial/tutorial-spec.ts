describe("Tutorial scenarios", function () {
  const username = Cypress.env("username");
  const password = Cypress.env("password");

  it("should allow to run a test and test should pass (BDD)", function () {
    expect(true).to.eq(true);
  });

  it("should allow to use other approach of assertion", function () {
    assert.isAbove(2, 1, "2 is greater than 1 ;)");
  });

  it("shouldn't pass this test", function () {
    expect(1).to.be.a("string");
  });

  it("should allow to visit web page", function () {
    cy.visit("https://example.cypress.io/");
    cy.contains("Kitchen Sink");
    cy.contains("h1", "Kitchen Sink");
    cy.get("div");
    cy.get("div.banner-alt")
      .contains("Commands")
      .parentsUntil("div.banner-alt")
      .find("p")
      .within(($paragraph) => {
        cy.root();
        const text = $paragraph.text();
        console.log(text);
      });
    cy.contains("h2", "Commands")
      .siblings()
      .first()
      .invoke("text")
      .then((paragraphText) => {
        console.log(paragraphText);
      });
    // cy.get(".home-list")
    //   .first()
    //   .find("li a")
    //   .first()
    //   .should("contain", "Querying")
    //   .click();
    cy.get(".home-list").first().contains("Querying").click();
    cy.url().should("include", "/commands/querying");
    cy.contains("h1", "Querying");
  });

  it("should allow to visit web app login site", function () {
    cy.visit("/");
    cy.getBySelector("signin-username")
      .as("usernameInput")
      .within(($usernameInput) => {
        cy.get("label").should("contain", "Username");
        cy.get("input")
          .should("have.attr", "name", "username")
          .and("have.attr", "type", "text");
      });
    cy.get("@usernameInput").should("be.visible");
    cy.get("@usernameInput")
      .find("input")
      .should("have.attr", "value", "")
      .type(username)
      .should("have.attr", "value", username);
    cy.getBySelector("signin-password")
      .find("input")
      .should("have.attr", "value", "")
      .type(password)
      .should("have.attr", "value", password);
    cy.intercept("POST", "/login").as("userLoginReq");
    cy.getBySelector("signin-submit").click();
    cy.wait("@userLoginReq")
      .its("response")
      .then((loginResp) => {
        cy.getBySelector("sidenav-username")
          .invoke("text")
          .should((sidenavUsername) => {
            expect(sidenavUsername).to.have.string(
              loginResp.body.user.username
            );
            expect(sidenavUsername).to.have.string(username);
          });
      });
  });

  it("should allow to send request and register user", function () {
    cy.request({
      method: "POST",
      url: `http://localhost:3001/users`,
      body: {
        confirmPassword: "12345",
        firstName: "reqname",
        lastName: "reqlastname",
        password: "12345",
        username: "requser",
      },
    });
  });
});
