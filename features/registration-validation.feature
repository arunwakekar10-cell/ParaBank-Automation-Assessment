@ui @signup @validation
Feature: ParaBank registration validation
  As ParaBank
  I want invalid registration attempts to be rejected
  So that only valid and unique customer accounts are created

  Background:
    Given I am on the ParaBank registration page

  @negative @required-fields
  Scenario: Show validation messages when required registration fields are blank
    When I submit the registration form without entering mandatory details
    Then registration required field validation messages should be displayed

  @negative @password-mismatch
  Scenario: Show validation message when password and confirmation do not match
    When I submit the registration form with mismatched passwords
    Then a password mismatch validation message should be displayed

  @negative @duplicate-username
  Scenario: Show validation message when the username already exists
    When I create a customer and try to register again with the same username
    Then a duplicate username validation message should be displayed
