require_relative 'page'

class SignUpPage < Page
  def self.visit
    page.visit '/account/new'
    new
  end

  def student?
    find_field("I'm a student").checked?
  end

  def teacher?
    find_field("I'm a teacher").checked?
  end
end
