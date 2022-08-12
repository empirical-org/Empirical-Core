# frozen_string_literal: true

namespace :fullnames do
  desc 'generate uids'
  task :generate => :environment do
    generate_fullnames
  end

  def generate_fullnames
    User.find_each do |user|
      new_name = GenerateFullname.run(user.name)
      user.name = new_name
      user.save(validate: false)
    end
  end
end
