# frozen_string_literal: true

namespace :learn_worlds do
  desc 'Convert existing LW usernames to Quill name'
  task :backfill_usernames => :environment do
    lw_users = LearnWorldsAccount.all
      .includes(:user)
      .filter {|row| row&.user }

    lw_users.each do |row|
      sleep 1
      puts "Backfilling user: #{row.user.name}"
      body = {username: ::Utils::String.to_username(row.user.username.presence || row.user.name) }

      HTTParty.post(
        "#{LearnWorldsIntegration::USER_TAGS_ENDPOINT}/#{row.external_id}",
        body:,
        headers: LearnWorldsIntegration::Request.new.headers
      )
    end
  end
end
