# frozen_string_literal: true

module LearnWorldsIntegration
  BASE_URI = ENV.fetch('LEARN_WORLDS_BASE_URI', '')
  CLIENT_ID = ENV.fetch('LEARN_WORLDS_CLIENT_ID', '')
  ACCESS_TOKEN = ENV.fetch('LEARN_WORLDS_ACCESS_TOKEN', '')

  SSO_ENDPOINT = "#{BASE_URI}/admin/api/sso"
  USER_TAGS_ENDPOINT = "#{BASE_URI}/v2/users"
  COURSES_ENDPOINT = "#{BASE_URI}/courses"

  WEBHOOK_SIGNATURE = ENV.fetch('LEARN_WORLDS_WEBHOOK_SIGNATURE', '')
end
