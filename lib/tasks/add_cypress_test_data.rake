require 'factory_bot_rails'
include FactoryBot::Syntax::Methods

namespace :add_cypress_test_data do
  task :add_users => :environment do
    add_users
  end

  task :add_school => :environment do
    add_school
  end

  task :add_sections => :environment do
    add_sections
  end

  def add_users
    User.find_or_initialize_by(role: 'staff', username: 'staff').update(password: 'password', name: 'Ryan Novas', email: 'r@gmail.com')
    User.find_or_initialize_by(role: 'teacher', username: 'teacher').update(password: 'password', name: 'Emilia Friedberg', email: 'e@gmail.com')
    User.find_or_initialize_by(role: 'student', username: 'student').update(password: 'password', name: 'Jenny Price')
  end

  def add_school
    School.find_or_create_by(name: 'Cool Bushwick School', zipcode: 11221)
  end

  def add_sections
    if Section.last.nil?
      create(:grade_1_section)
      create(:grade_2_section)
      create(:grade_3_section)
      create(:grade_4_section)
      create(:grade_5_section)
      create(:grade_6_section)
      create(:grade_7_section)
      create(:grade_8_section)
      create(:grade_9_section)
      create(:grade_10_section)
      create(:grade_11_section)
      create(:grade_12_section)
      create(:university_section)
    end
  end

end
