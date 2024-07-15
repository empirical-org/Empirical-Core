# frozen_string_literal: true

namespace :learn_worlds do
  desc 'Convert existing LW usernames to Quill name'
  task :backfill_usernames => :environment do
    lw_users = LearnWorldsAccount.all
      .includes(:user)
      .filter {|row| row&.user }

    lw_users.each do |row|
      body = {username: ::Utils::String.to_username(row.user.username.presence || row.user.name) }

      result = HTTParty.put(
        "#{LearnWorldsIntegration::USER_TAGS_ENDPOINT}/#{row.external_id}",
        body: body.to_json,
        headers: LearnWorldsIntegration::Request.new.headers
      )

      puts "Backfilling user: #{row.user.name}, HTTP response: #{result.code}"
    end

  end
end
