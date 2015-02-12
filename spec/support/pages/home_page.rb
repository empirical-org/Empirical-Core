require_relative 'page'

class HomePage < Page
  def self.visit
    page.visit '/'
    new
  end

  def sign_up_as_a_student
    click_link "I'm a Student"
    SignUpPage.new
  end

  def sign_up_as_a_teacher
    click_link "I'm a Teacher"
    SignUpPage.new
  end
end
