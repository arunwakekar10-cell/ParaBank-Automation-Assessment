@ui @signup @login
Feature: ParaBank customer account creation and sign in
  As a new ParaBank customer
  I want to register and sign in with my account
  So that I can view my account overview and the amount displayed after login

  Background:
    Given I am on the ParaBank registration page

  @smoke @e2e @positive
  Scenario: Create a new account, sign out, sign in, and print the displayed amount
    When I register with valid customer details
    Then the account should be created successfully
    When I sign out from ParaBank
    And I sign in with the newly created account
    Then I should see the account overview and print the displayed amount
