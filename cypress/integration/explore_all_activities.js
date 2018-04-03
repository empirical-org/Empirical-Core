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
      factory: 'teacher_with_a_couple_classrooms_with_a_couple_students_each',
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

  describe('stage 2', function() {
    it('lets me name the activity pack', function() {
      cy.get('#unit_name').type('Whomst')
    })

    it('displays a block for each of my classrooms', function() {
      cy.get('.panel-group').should('have.length', 2)
    })

    it('allows me to select an entire classroom', function() {
      cy.get(':nth-child(3) > :nth-child(1) > .panel-heading > .title > div > .css-label').click()
      cy.get(':nth-child(3) > :nth-child(1) > .panel-heading > .title > div > .css-label > span').contains('All 2 will be assigned')
    })

    it('allows me to unselect an entire classroom', function() {
      cy.get(':nth-child(3) > :nth-child(1) > .panel-heading > .title > div > .css-label').click()
      cy.get(':nth-child(3) > :nth-child(1) > .panel-heading > .title > div > .css-label > span').contains('0 students will be assigned')
    })

    it('allows me to click on a classroom to see all the students', function() {
      cy.get(':nth-child(4) > :nth-child(1) > .panel-heading > .title > .toggle-button > .panel-select-by-student').click()
      cy.get('.student-panel-body')
    })

    it('allows me to select individual students', function() {
      cy.get(':nth-child(4) > :nth-child(1) > .panel > .panel-collapse > :nth-child(1) > .panel-body > :nth-child(1) > .css-label').click()
      cy.get(':nth-child(4) > :nth-child(1) > .panel-heading > .title > div > .css-label > span').contains('1 out of 2 students will be assigned')
    })

    it('allows me to unselect individual students', function() {
      cy.get(':nth-child(4) > :nth-child(1) > .panel > .panel-collapse > :nth-child(1) > .panel-body > :nth-child(1) > .css-label').click()
      cy.get(':nth-child(4) > :nth-child(1) > .panel-heading > .title > div > .css-label > span').contains('0 students will be assigned')
    })

    it('allows me to select a due date for an activity', function() {
      cy.get('.react-datepicker__input-container > input').click()
      cy.get('[aria-label="day-28"]').click()
    })

    it('displays an error if I try to assign the activity pack without selecting who to assign it to', function() {
      cy.get('#assign')
      cy.contains('Please select students')
    })

    it('displays an error if I try to assign the activity pack without a name', function() {
      cy.get(':nth-child(4) > :nth-child(1) > .panel > .panel-collapse > :nth-child(1) > .panel-body > :nth-child(1) > .css-label').click()
      cy.get('#unit_name').clear()
      cy.contains('Please provide a name for your activity pack.')
    })

    it('lets me assign the activity pack if there are selected students and a name and redirects me to My Activities', function() {
      cy.get('#unit_name').type('Whomst')
      cy.get('#assign').click()
      cy.url().should('include', '/teachers/classrooms/activity_planner')
    })
  })



})
