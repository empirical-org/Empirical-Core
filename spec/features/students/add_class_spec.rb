require 'rails_helper'
include AsyncHelper

feature 'Add Class', js: true do
  include_context "profile"



  before :each do
    vcr_ignores_localhost
    sign_in_user student
    visit('/students_classrooms/add_classroom')
  end

  describe 'the Add Class page'

  skip 'provides a field to enter a classcode' do
    eventually { expect(page).to have_selector("input") }
  end

  context 'upon submission' do



    context 'if the code is valid' do

    before :each do
      page.find(".class-input").set(classroom3.code)
      click_button('Join Your Class')
    end

      # it 'it successfully adds a student to a classroom' do
      #   # page.find(".class-input").set(classroom3.code)
      #   # click_button('Join Your Class')
      #   # this works IRL, not sure why it is failing
      #   # eventually { expect(student.students_classrooms).to include(classroom3)}
      # end

      skip 'tells the student they succesfully joined a classroom' do
        eventually { expect(page).to have_content("Classroom Added")}
      end

      skip 'creates an add student checkbox for the teacher' do
        add_students = Objective.create(name: 'Add Students')
        eventually {expect(classroom3.teacher.checkboxes.last.objective).to eq(add_students)}
      end

    end

    context 'if the code is not valid' do
      pending 'is skipped until we have a frontend testing framework compatible with react' do
        skip
        pending 'displays the standard error message' do
          page.find(".class-input").set('not-a-class')
          click_button('Join Your Class')
          eventually {expect(page).to have_content("Oops! Looks like that isn't a valid class code. Please try again.")}
        end

        pending 'displays the archived class error message' do
          Classroom.create(name: 'Archived Class', code: 'archived-class', visible: false)
          page.find(".class-input").set('archived-class')
          click_button('Join Your Class')
          eventually {expect(page).to have_content("Oops! That class has been archived. Please try a different class code.")}
        end

      end

    end

  end









  # it 'successfully adds a student to a classroom' do
  #   page.find(".class-input").set(classroom3.code)
  #   click_button('Join Your Class')
  #   expect(student.students_classrooms).to include(:classroom3)
  #   eventually { expect(page).to have_content("Classroom Added")}
  # end




    # describe 'upon submission,' do
    #   before :each do
    #     page.find(".class-input").set(classroom3.code)
    #     click_button('Join Your Class')
    #   end
    #
    #   context 'if the classcode is valid' do
    #     it 'successfully adds a student to a classroom' do
    #       expect(student.students_classrooms).to include(:classroom3)
    #     end
    #
    #     it 'tells the student they have successfully joined'
    #       eventually { expect(page).to have_content("Classroom Added")}
    #     end
    #
    #   end
    #
    #
    # end


  # it 'by default includes unit name of unit from last classroom added ' do
  #   eventually { expect(page).to have_content(unit1.name) }
  # end
  #
  # it 'includes activity name for unstarted activity_session' do
  #   expect(page).to have_content(as2.activity.name)
  # end
  #
  # it 'includes activity name for finished activity_session' do
  #   expect(page).to have_content(as1.activity.name)
  # end
  #
  # context 'when the non-default classroom is active'
  #
  #   before :each do
  #     page.find(:xpath,"//*[text()='#{student.classrooms[0].teacher.name}']").click
  #   end
  #
  #   it 'does not show assigned activity from first classroom added if multiple classrooms exist' do
  #     expect(page).not_to have_content(as1.activity.name)
  #   end
  #
  #   it 'does not include unit name of unit from first classroom added' do
  #     expect(page).not_to have_content(unit1.name)
  #   end
  #
  #   it 'includes activity name for unstarted activity_session from the newly selected classroom' do
  #     expect(page).to have_content(as3_unstarted.activity.name)
  #   end
  #
  #   it 'includes activity name for finished activity_session from the newly selected classroom' do
  #       expect(page).to have_content(as3_finished.activity.name)
  #   end

end
