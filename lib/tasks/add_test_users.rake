require 'factory_bot_rails'
include FactoryBot::Syntax::Methods

namespace :add_test_users do
  task :create => :environment do

    User.find_or_create_by(role: 'staff', username: 'staff').update(password: 'password')

    User.find_or_create_by(role: 'teacher', username: 'teacher').update(password: 'password')

    User.find_or_create_by(role: 'student', username: 'student').update(password: 'password')

  end

end
