# frozen_string_literal: true

module Auth
  module LearnWorlds
    BASE_URI = ENV.fetch('LEARN_WORLDS_BASE_URI', '')
    CLIENT_ID = ENV.fetch('LEARN_WORLDS_CLIENT_ID', '')
    ACCESS_TOKEN = ENV.fetch('LEARN_WORLDS_ACCESS_TOKEN', '')

    SSO_ENDPOINT = "#{BASE_URI}/admin/api/sso"
    COURSES_ENDPOINT = "#{BASE_URI}/courses"
  end
end
