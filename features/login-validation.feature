@ui @login @validation
Feature: ParaBank login validation
  As ParaBank
  I want invalid login attempts to be rejected
  So that customer accounts remain protected

  @negative @invalid-login
  Scenario: Show validation message for invalid login credentials
    Given I am on the ParaBank login page
    When I sign in with invalid credentials
    Then an invalid login error should be displayed
