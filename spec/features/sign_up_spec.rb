require 'rails_helper'

feature 'Teacher signup' do
  let(:sign_up_page) { SignUpPage.visit }

  let(:class_name) { 'first period' }

  scenario 'allows class creation', js: true do
    VCR.configuration.ignore_localhost = true

    new_teacher_classrooms_page = sign_up_page.sign_up(
                                    type: :teacher,
                                    name: 'Some Name',
                                username: 'somename',
                                password: 'some_password',
                   password_confirmation: 'some_password',
                                   email: 'some.name@email.provider.com',
                                 zipcode: '12345')

    class_code = new_teacher_classrooms_page.class_code

    invite_students_page = new_teacher_classrooms_page
                             .create_class(name: class_name,
                                          grade: 2)

    expect(invite_students_page.selected_class).to eq class_name
    expect(invite_students_page.class_code)    .to eq class_code
  end
end
