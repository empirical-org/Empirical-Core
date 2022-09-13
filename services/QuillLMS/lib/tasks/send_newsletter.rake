# frozen_string_literal: true

namespace :send_newsletter do
  desc 'set send_newsletter to true for all teachers'
  task :run => :environment do
    User.where(role: 'teacher').update_all(send_newsletter: true)
  end
end
