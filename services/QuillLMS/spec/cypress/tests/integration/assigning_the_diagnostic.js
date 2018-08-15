describe('Assigning unit templates flow', () => {
  before(function() {
    cy.logout()
    cy.cleanDatabase().then(() => {
      cy.factoryBotCreate({
        factory: 'diagnostic_activity',
        name: 'Sentence Structure Diagnostic',
        id: 413
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'unit_template',
          id: 20,
          name: 'Sentence Structure Diagnostic'
        })
      })
      cy.factoryBotCreate({
        factory: 'diagnostic_activity',
        name: 'ELL Diagnostic',
        id: 447
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'unit_template',
          id: 34,
          name: 'ELL Diagnostic'
        })
      })
      cy.factoryBotCreate({
        factory: 'teacher_with_a_couple_classrooms_with_a_couple_students_each',
        password: 'password',
        email: 'someone@gmail.com'
      }).then(() => {
        cy.login('someone@gmail.com', 'password')
        cy.visit('/teachers/classrooms/assign_activities/assign-a-diagnostic')
      })
    })
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  after(function() {
    cy.logout()
  })

  describe('choosing the sentence structure diagnostic', function() {
    it('clicking the sentence structure diagnostic\'s mini takes me to stage 1', function() {
      cy.get('.assignment-type-mini').contains('Sentence Structure Diagnostic').click()
      cy.url().should('include', '/diagnostic/413/stage/1')
    })
    it('which shows a modal with four slides', function() {
      cy.get('.diagnostic-overview-modal').contains('Next').click()
      cy.get('.diagnostic-overview-modal').contains('Next').click()
      cy.get('.diagnostic-overview-modal').contains('Next').click()
      cy.get('.diagnostic-overview-modal').contains('Next').click()
    })
    it('and take me to stage 2, which shows a page with the option to either preview or assign the diagnostic', function() {
      cy.url().should('include', '/diagnostic/413/stage/2')
      cy.contains('Preview the Diagnostic').parent().should('have.attr', 'href').should('include', 'activity_sessions/anonymous?activity_id=413')
    })
    it('clicking Continue to Assign takes me to the assignment page', function() {
      cy.contains('Continue to Assign').click()
      cy.url().should('include', '/diagnostic/413/stage/3')
    })
    it('where I can select a class', function() {
      cy.get('.panel-group').first().contains('0 students will be assigned')
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').first().contains('All 2 will be assigned')
    })
    it('and I can unselect a class', function() {
      cy.get('.panel-group').first().contains('All 2 will be assigned')
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').first().contains('0 students will be assigned')
    })
    it('and click select by student to see all the students in a class', function() {
      cy.get('.panel-group').last().contains('Select by Student').click()
      cy.get('.student-panel-body')
    })
    it('and select a student', function() {
      cy.get('.panel-group').last().contains('0 students will be assigned')
      cy.get('.panel-group').last().find('.student-panel-body .css-label').first().click()
      cy.get('.panel-group').last().contains('1 out of 2 students will be assigned')
    })
    it('and unselect a student', function() {
      cy.get('.panel-group').last().contains('1 out of 2 students will be assigned')
      cy.get('.panel-group').last().find('.student-panel-body .css-label').first().click()
      cy.get('.panel-group').last().contains('0 students will be assigned')
    })
    it('and assign selected students', function() {
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').eq(1).find('.css-label').first().click()
      cy.contains('Save & Assign').click()
    })
    it('which takes me to the success page', function() {
      cy.url().should('include', '/diagnostic/413/success')
    })
    it('clicking View Assigned Activity Packs takes me to My Activities', function() {
      cy.contains('View Assigned Activity Packs').click()
      cy.url().should('include', '/teachers/classrooms/activity_planner#')
    })
    it('where the sentence structure diagnostic is assigned', function() {
      cy.get('.activities-unit').should('have.length', 1)
      cy.get('.unit-header-row').contains('Sentence Structure Diagnostic')
    })
  })

  describe('choosing the ell diagnostic', function() {
    it('clicking the ell diagnostic\'s mini', function() {
      cy.visit('/teachers/classrooms/assign_activities/assign-a-diagnostic')
      cy.get('.assignment-type-mini').contains('ELL Diagnostic').click()
    })
    it('takes me to stage 2, which shows a page with the option to either preview or assign the diagnostic', function() {
      cy.url().should('include', '/diagnostic/447/stage/2')
      cy.contains('Preview the Diagnostic').parent().should('have.attr', 'href').should('include', 'activity_sessions/anonymous?activity_id=447')
    })
    it('clicking Continue to Assign takes me to the assignment page', function() {
      cy.contains('Continue to Assign').click()
      cy.url().should('include', '/diagnostic/447/stage/3')
    })
    it('where I can select a class', function() {
      cy.get('.panel-group').first().contains('0 students will be assigned')
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').first().contains('All 2 will be assigned')
    })
    it('and I can unselect a class', function() {
      cy.get('.panel-group').first().contains('All 2 will be assigned')
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').first().contains('0 students will be assigned')
    })
    it('and click select by student to see all the students in a class', function() {
      cy.get('.panel-group').eq(1).contains('Select by Student').click()
      cy.get('.student-panel-body')
    })
    it('and select a student', function() {
      cy.get('.panel-group').eq(1).contains('0 students will be assigned')
      cy.get('.panel-group').eq(1).find('.student-panel-body .css-label').first().click()
      cy.get('.panel-group').eq(1).contains('1 out of 2 students will be assigned')
    })
    it('and unselect a student', function() {
      cy.get('.panel-group').eq(1).contains('1 out of 2 students will be assigned')
      cy.get('.panel-group').eq(1).find('.student-panel-body .css-label').first().click()
      cy.get('.panel-group').eq(1).contains('0 students will be assigned')
    })
    it('and I can open the add a class modal', function() {
      cy.get('#add-a-class-button').click()
    })
    it('and fill out the form to add a class', function() {
      cy.get('#class-name').type('New Class')
      cy.get('#select-grade').click()
      cy.get('.dropdown-menu > :nth-child(5) > a').click()
      cy.contains('Create a Class').click()
    })
    it('and see my new class', function() {
      // cy.get('.panel-group').contains('New Class')
      cy.get('.panel-group').should('have.length', 3)
    })
    it('and open the modal and close it without adding a class', function() {
      cy.get('#add-a-class-button').click()
      cy.get('.react-bootstrap-close').click()
    })
    it('and assign selected students', function() {
      cy.get('.panel-group').first().find('.css-label').first().click()
      cy.get('.panel-group').eq(1).find('.css-label').first().click()
      cy.contains('Save & Assign').click()
    })
    it('which takes me to the success page', function() {
      cy.url().should('include', '/diagnostic/447/success')
    })
    it('clicking View Assigned Activity Packs takes me to My Activities', function() {
      cy.contains('View Assigned Activity Packs').click()
      cy.url().should('include', '/teachers/classrooms/activity_planner#')
    })
    it('where the sentence structure diagnostic is assigned', function() {
      cy.get('.activities-unit').should('have.length', 2)
      cy.get('.activities-unit').last().find('.unit-header-row').contains('ELL Diagnostic')
    })
  })


})
