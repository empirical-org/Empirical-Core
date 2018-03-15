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
    User.find_or_create_by(role: 'staff', username: 'staff').update(password: 'password')
    User.find_or_create_by(role: 'teacher', username: 'teacher').update(password: 'password')
    User.find_or_create_by(role: 'student', username: 'student').update(password: 'password')
  end

  def add_school
    School.find_or_create_by(name: 'Cool Bushwick School', zipcode: 11221)
  end

end
