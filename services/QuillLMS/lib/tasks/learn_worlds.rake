# frozen_string_literal: true

namespace :learn_worlds do
  desc 'Convert existing LW usernames to Quill name'
  task :backfill_username => :environment do
    headers = {
      'Lw-Client' => CLIENT_ID,
      'Authorization' => "Bearer #{ACCESS_TOKEN}"
    }

    lw_users = LearnWorldsAccount.all
      .includes(:user)
      .filter {|row| row&.user }

    lw_users.each do |user|
      sleep 1
      body = {username: user.username.presence || user.name }

      HTTParty.post(
        "#{LearnWorldsIntegration::USER_TAGS_ENDPOINT}/#{user.external_id}",
        body:,
        headers: LearnWorldsIntegration::Request.new.headers
      )
    end
  end
end