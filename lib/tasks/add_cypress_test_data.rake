require 'factory_bot_rails'
include FactoryBot::Syntax::Methods

namespace :add_cypress_test_data do
  task :add_users => :environment do
    add_users
  end

  task :add_school => :environment do
    add_school
  end

  def add_users
    User.find_or_initialize_by(role: 'staff', username: 'staff').update(password: 'password', name: 'Ryan Novas', email: 'r@gmail.com')
    User.find_or_initialize_by(role: 'teacher', username: 'teacher').update(password: 'password', name: 'Emilia Friedberg', email: 'e@gmail.com')
    User.find_or_initialize_by(role: 'student', username: 'student').update(password: 'password', name: 'Jenny Price')
  end

  def add_school
    School.find_or_create_by(name: 'Cool Bushwick School', zipcode: 11221)
  end

end
