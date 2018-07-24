describe('Assigning unit templates flow', () => {
  before(function() {
    cy.cleanDatabase()
    cy.factoryBotCreateList({
      factory: 'unit_template_with_activities',
      number: 5
    })
    cy.factoryBotCreate({
      factory: 'teacher_with_a_couple_classrooms_with_a_couple_students_each',
      password: 'password',
      email: 'someone@gmail.com'
    }).then(() => {
      cy.login('someone@gmail.com', 'password')
      cy.visit('/teachers/classrooms/assign_activities/featured-activity-packs')
    })
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  after(function() {
    cy.logout()
  })

  describe('selecting a unit template', function() {
    it('clicking a unit template mini takes me to the unit template\'s profile page', function() {
      cy.get('.unit-template-mini').first().click()
      cy.url().should('include', '/teachers/classrooms/assign_activities/featured-activity-packs/')
    })
  })

  describe('assigning the unit template to all students', function() {
    it('clicking the assign to all students button will assign the pack to all my students', function() {
      cy.contains('Assign to All Students').click()
      cy.url().should('include', '/assigned')
      cy.contains('View Assigned Activity Packs').click()
      cy.url().should('include', '/teachers/classrooms/activity_planner#')
      // commenting out the line below because it is just taking too long for the unit to show up
      cy.get('.activities-unit').should('have.length', 1)
    })
  })

  describe('assigning the unit template to some students', function() {
    it('clicking the customize students button will take me to the customize students page', function() {
      cy.visit('/teachers/classrooms/assign_activities/featured-activity-packs')
      cy.get('.unit-template-mini').eq(3).click()
      cy.contains('Customize Students').click()
      cy.url().should('include', '/teachers/classrooms/assign_activities/new_unit/students/edit/name')
    })

    it('displays a block for each of my classrooms', function() {
      cy.get('.panel-group').should('have.length', 2)
    })

    it('will not allow me to assign the activity pack with no students selected', function() {
      cy.contains('Add Students Before Assigning').click()
      cy.url().should('include', '/teachers/classrooms/assign_activities/new_unit/students/edit/name')
    })

    it('allows me to select an entire classroom', function() {
      cy.get('.panel-group').first().find('.panel-heading > .title > div > .css-label').click()
      cy.get('.panel-group').first().find('.panel-heading > .title > div > .css-label > span').contains('All 2 will be assigned')
    })

    it('allows me to unselect an entire classroom', function() {
      cy.get('.panel-group').first().find('.panel-heading > .title > div > .css-label').click()
      cy.get('.panel-group').first().find('.panel-heading > .title > div > .css-label > span').contains('0 students will be assigned')
    })

    it('allows me to click on a classroom to see all the students', function() {
      cy.get('.panel-group').last().find('.panel-heading > .title > .toggle-button > .panel-select-by-student').click()
      cy.get('.student-panel-body')
    })

    it('allows me to select individual students', function() {
      cy.get('.panel-group').last().find('.panel > .panel-collapse > :nth-child(1) > .panel-body > :nth-child(1) > .css-label').click()
      cy.get('.panel-group').last().find('.panel-heading > .title > div > .css-label > span').contains('1 out of 2 students will be assigned')
    })

    it('allows me to unselect individual students', function() {
      cy.get('.panel-group').last().find('.panel > .panel-collapse > :nth-child(1) > .panel-body > :nth-child(1) > .css-label').click()
      cy.get('.panel-group').last().find('.panel-heading > .title > div > .css-label > span').contains('0 students will be assigned')
    })

    it('allows me to assign the activity pack to selected students', function() {
      cy.get('.panel-group').last().find('.panel-heading > .title > div > .css-label').click()
      cy.contains('Assign Activity Pack').click()
      cy.url().should('include', '/teachers/classrooms/activity_planner')
      // commenting out the line below because it is just taking too long for the unit to show up
      cy.get('.activities-unit').should('have.length', 2)
    })
  })
})
