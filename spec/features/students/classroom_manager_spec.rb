require 'rails_helper'
include AsyncHelper

feature 'Student Classroom Manager', js: true do
  include_context "profile"


  before :each do
    vcr_ignores_localhost
    sign_in_user student
    visit('/students_classrooms/classroom_manager')
  end

  describe 'the Classroom Manager page' do

    it 'renders the correct view' do
      page.find("#students_classrooms_manager")
    end

    it 'shows a list displaying all of the current users active classrooms' do
      eventually { expect(page).to have_content(classroom1.name) }
      eventually { expect(page).to have_content(classroom2.name) }
    end

    it 'can archive an existing classroom' do
      cl = student.classrooms.first
      find(".#{cl.name.gsub(/\s+/, '')}", :text => 'Archive').click
      eventually { expect(StudentsClassrooms.unscoped.where(student_id: student.id, visible: false, classroom_id: cl.id).count).to eq(1)}
    end

    # TODO: get this one passing
    # it 'shows a list displaying all of the current users archived classrooms' do
    #   eventually { expect(page).to have_content(classroom1.name) }
    #   eventually { expect(page).to have_content(classroom2.name) }
    # end

  end

end

#   context 'upon submission' do
#
#
#
#     context 'if the code is valid' do
#
#     before :each do
#       page.find(".class-input").set(classroom3.code)
#       click_button('Join Your Class')
#     end
#
#       it 'it successfully adds a student to a classroom' do
#         # page.find(".class-input").set(classroom3.code)
#         # click_button('Join Your Class')
#         # this works IRL, not sure why it is failing
#         eventually { expect(student.students_classrooms).to include(classroom3)}
#       end
#
#       it 'tells the student they succesfully joined a classroom' do
#         eventually { expect(page).to have_content("Classroom Added")}
#       end
#
#     end
#
#     context 'if it the code is not valid' do
#
#       it 'displays an error message' do
#         page.find(".class-input").set('not-a-class')
#         click_button('Join Your Class')
#         eventually {expect(page).to have_content("Invalid Classcode")}
#       end
#
#     end
#
#   end
#
#
# end
