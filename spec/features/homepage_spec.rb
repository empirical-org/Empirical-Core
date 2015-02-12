require 'rails_helper'

feature 'the homepage' do
  given(:home_page) { HomePage.visit }

  scenario 'helps the user sign up as a student' do
    sign_up_page = home_page.sign_up_as_a_student

    expect(sign_up_page).to be_a_student
  end

  scenario 'helps the user sign up as a teacher' do
    sign_up_page = home_page.sign_up_as_a_teacher

    expect(sign_up_page).to be_a_teacher
  end
end
