require_relative 'page'

class SignUpPage < Page
  def self.visit
    page.visit '/account/new'
    new
  end

  def be_a_student
    choose student_text # radio button
  end

  def be_a_teacher
    choose teacher_text # radio button
  end

  def sign_up(type: nil,
              name: '',
          username: '',
          password: '', password_confirmation: '',
             email: '',
           zipcode: '')

    send :"be_a_#{type}" if type.present?

    fill_in :user_name,                  with: name
    fill_in :user_username,              with: username
    fill_in :user_password,              with: password
    fill_in :user_password_confirmation, with: password_confirmation
    fill_in :user_email,                 with: email

    fill_in :zipcode,                    with: zipcode
    check   :school_not_found

    check   :user_terms_of_service
    uncheck :user_newsletter

    click_on 'Sign up'

    Teachers::Classrooms::NewPage.new
  end

  def student?
    find_field(student_text).checked?
  end

  def teacher?
    find_field(teacher_text).checked?
  end

  private

  def student_text
    "I'm a student"
  end

  def teacher_text
    "I'm a teacher"
  end
end
