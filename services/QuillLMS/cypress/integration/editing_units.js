describe('Editing Units', function() {
  before(function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'activity',
      traits: ['production'],
      name: 'Unassigned Activity'
    })
    cy.factoryBotCreate({
      factory: 'teacher',
      traits: ['with_classrooms_students_and_activities'],
      password: 'password',
      email: 'someone@gmail.com'
    }).then(() => {
      cy.login('someone@gmail.com', 'password')
      cy.visit('/teachers/classrooms/activity_planner')
    })
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  describe('editing the name of the unit', () => {
    it ('gives me an error if I try to rename the unit something with no content', () => {
      cy.get('.activities-unit:first-of-type').contains('Edit Name').click()
      cy.get('.activities-unit:first-of-type .unit-name > input').clear()
      cy.get('.activities-unit:first-of-type').contains('Submit').click()
      cy.get('.errors').contains('Unit must have a name. Click here to try again.').click()
    })
    it ('gives me an error if I try to rename the unit with the name of another unit', () => {
      cy.get('.activities-unit:first-of-type .unit-name > input').clear()
      cy.get('.activities-unit:first-of-type .unit-name > input').type('Unit B')
      cy.get('.activities-unit:first-of-type').contains('Submit').click()
      cy.get('.activities-unit:first-of-type .errors').contains('Unit must have a unique name. Click here to try again.').click()
    })
    it ('allows me to edit the name of the unit', () => {
      cy.get('.activities-unit:first-of-type .unit-name > input').clear()
      cy.get('.activities-unit:first-of-type .unit-name > input').type('I Am Editable')
      cy.get('.activities-unit:first-of-type').contains('Submit').click()
      cy.visit('/teachers/classrooms/activity_planner')
      cy.contains('I Am Editable')
    })
  })

  describe('deleting an activity from the unit', () => {
    it ('allows me to delete an activity from the pack', () => {
      cy.get('.activities-unit:first-of-type .activity').should('have.length', 3)
      cy.get('.activities-unit:first-of-type .activity:first-of-type .delete-classroom-activity').click()
      cy.visit('/teachers/classrooms/activity_planner')
      cy.get('.activities-unit:first-of-type .activity').should('have.length', 2)
    })
  })

  describe('changing the due date for an activity', () => {
    it ('allows me to change one activity\'s due date', () => {
      cy.get('.activities-unit:first-of-type .activity:first-of-type .due-date-input').click()
      cy.get('[aria-label="day-28"]:last-of-type').click()
    })

    it ('allows me to apply the first activity\'s due date to the whole unit', () => {
      cy.get('.activities-unit:first-of-type .activity:nth-of-type(2) .due-date-input').should('be.empty')
      cy.get('.activities-unit:first-of-type .activity:first-of-type .apply-to-all').click()
      cy.get('.activities-unit:first-of-type .activity:nth-of-type(2) .due-date-input').should('have.attr', 'value').should('match', /28/)
    })
  })

  describe('adding more activities to a unit', () => {
    it ('allows me to add more activities to the unit', () => {
      cy.get('.activities-unit:first-of-type').contains('Add More Activities To This Pack').click()
      cy.contains('Unassigned Activity').parent().parent().find('.css-label').click()
      cy.contains('Update Activities').click()
      cy.get('.activities-unit:first-of-type .activity').should('have.length', 3)
    })
  })

  describe('editing classes and students', () => {
    it ('allows me to unassign a class', () => {
      cy.get('.activities-unit:first-of-type').contains('Assigned to 2 classes')
      cy.get('.activities-unit:first-of-type').contains('Edit Classes & Students').click()
      cy.get('.panel-group').first().contains('All 3 will be assigned')
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').first().contains('0 students will be assigned')
      cy.contains('Update Students').click()
      cy.get('.activities-unit:first-of-type').contains('Assigned to 1 class')
    })
    it ('allows me to assign a class', () => {
      cy.get('.activities-unit:first-of-type').contains('Assigned to 1 class')
      cy.get('.activities-unit:first-of-type').contains('Edit Classes & Students').click()
      cy.get('.panel-group').first().contains('0 students will be assigned')
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').first().contains('All 3 will be assigned')
      cy.contains('Update Students').click()
      cy.get('.activities-unit:first-of-type').contains('Assigned to 2 classes')
    })
    it ('allows me to unassign students', () => {
      cy.get('.activities-unit:first-of-type').contains('Edit Classes & Students').click()
      cy.get('.panel-group').first().contains('All 3 will be assigned')
      cy.get('.panel-group').first().contains('Select by Student').click()
      cy.get('.student:first-of-type > .css-label').first().click()
      cy.get('.panel-group').first().contains('2 out of 3 students will be assigned')
      cy.contains('Update Students').click()
    })
    it ('allows me to reassign students', () => {
      cy.get('.activities-unit:first-of-type').contains('Edit Classes & Students').click()
      cy.get('.panel-group').first().contains('2 out of 3 students will be assigned')
      cy.get('.panel-group').first().contains('Select by Student').click()
      cy.get('.panel-group').first().find('.student:first-of-type > .css-label').first().click()
      cy.get('.panel-group').first().contains('All 3 will be assigned')
      cy.contains('Update Students').click()
    })
    it ('allows me to unassign a class by unassigning each student', () => {
      cy.get('.activities-unit:first-of-type').contains('Assigned to 2 classes')
      cy.get('.activities-unit:first-of-type').contains('Edit Classes & Students').click()
      cy.get('.panel-group').first().contains('All 3 will be assigned')
      cy.get('.panel-group').first().contains('Select by Student').click()
      cy.get('.panel-group').first().find('.student > .css-label').click({multiple: true})
      cy.get('.panel-group').first().contains('0 students will be assigned')
      cy.contains('Update Students').click()
      cy.get('.activities-unit:first-of-type').contains('Assigned to 1 class')
    })
    it ('allows me to archive a unit by unassigning both classes', () => {
      cy.get('.activities-unit').should('have.length', 3)
      cy.get('.activities-unit:first-of-type').contains('Edit Classes & Students').click()
      cy.get('.panel-group').last().find('.css-label').first().click()
      cy.get('.panel-group').last().contains('0 students will be assigned')
      cy.contains('Update Students').click()
      cy.get('.activities-unit').should('have.length', 2)
    })
  })

  describe('archiving a unit by deleting all activities', () => {
    it('allows me to archive a unit by deleting all of its activities', () => {
      cy.get('.activities-unit').should('have.length', 2)
      cy.get('.activities-unit:first-of-type .delete-classroom-activity').click({multiple: true})
      cy.visit('/teachers/classrooms/activity_planner')
      cy.get('.activities-unit').should('have.length', 1)
    })
  })

  describe('archiving a unit by deleting all activities', () => {
    it('allows me to archive a unit by deleting all of its activities', () => {
      cy.get('.activities-unit').should('have.length', 1)
      cy.get('.activities-unit:first-of-type .delete-unit').click()
      cy.visit('/teachers/classrooms/activity_planner')
      cy.get('.no-activity-packs')
    })
  })

  after(function() {
    cy.logout()
  })

})
