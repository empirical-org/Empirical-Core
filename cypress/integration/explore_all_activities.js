describe('Explore All Activities page', function() {
  before(function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'diagnostic_activity',
      name: 'Diagnostic Activity',
      traits: ['production']
    })
    cy.factoryBotCreate({
      factory: 'proofreader_activity',
      name: 'Proofreader Activity',
      traits: ['production']
    })
    cy.factoryBotCreate({
      factory: 'grammar_activity',
      name: 'Grammar Activity',
      traits: ['production']
    })
    cy.factoryBotCreate({
      factory: 'connect_activity',
      name: 'Connect Activity',
      traits: ['production']
    })
    cy.factoryBotCreate({
      factory: 'lesson_activity',
      name: 'Lesson Activity',
      traits: ['production']
    })
    cy.factoryBotCreate({
      factory: 'teacher_with_one_classroom',
      password: 'password',
      email: 'someone@gmail.com'
    }).then(() => {
      cy.login('someone@gmail.com', 'password')
      cy.visit('/teachers/classrooms/assign_activities/create-unit')
    })
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  after(function() {
    cy.logout()
  })

  describe('stage 1', function() {
    it('displays activities', function() {
      cy.get('.search-and-select').find('tr.tooltip-trigger').should('have.length', 5)
    })

    it('lets me search for activities', function() {
      cy.get('#search_activities_input').type('Grammar')
      cy.get('#search_activities_button').click()
      cy.get('.search-and-select').find('tr.tooltip-trigger').should('not.have.length', 5)
    })

    it('lets me clear filters and searches', function() {
      cy.get('.clear-button').click()
      cy.get('.search-and-select').find('tr.tooltip-trigger').should('have.length', 5)
    })

    it('lets me click the filter by concept button to open a dropdown and select a concept', function() {
      cy.contains('Filter By Concept').click()
      cy.get('.dropdown-menu')
      cy.get(':nth-child(1) > .activity-filter-button-wrapper > .dropdown-menu > :nth-child(3) > .filter_option').click()
      cy.get('.search-and-select').find('tr.tooltip-trigger').should('not.have.length', 5)
    })

    it('lets me click the filter by level button to open a dropdown and select a level', function() {
      cy.get('.clear-button').click()
      cy.contains('Filter By Level').click()
      cy.get('.dropdown-menu')
      cy.get(':nth-child(2) > .activity-filter-button-wrapper > .dropdown-menu > :nth-child(2) > .filter_option').last().click()
      cy.get('.search-and-select').find('tr.tooltip-trigger').should('not.have.length', 5)
    })

    it('lets me select an activity', function() {
      cy.get('.clear-button').click()
      cy.get(':nth-child(2) > :nth-child(4) > .css-label').click()
      cy.contains('Selected Activities for New Activity Pack')
      cy.get('.selected-activities-section').find('tr').should('have.length', 1)
    })

    it('lets me deselect an activity', function() {
      cy.get('.deselect-activity').click()
      cy.get('.selected-activities-section').should('have.length', 0)
    })

    it('gives me an error if I try to Continue with no activities selected', function() {
      cy.contains('Continue').click()
      cy.contains('Please select activities')
    })

    it('lets me continue if I select an activity and then press Continue', function() {
      cy.get(':nth-child(2) > :nth-child(4) > .css-label').click()
      cy.contains('Continue').click()
    })
  })



})
