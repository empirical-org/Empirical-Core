# frozen_string_literal: true

module Evidence
  module OpenAI
    API_KEY = ENV['OPENAI_API_KEY']
    MAX_COUNT = 128 # API has an undocument max of 128 for 'n'
  end
end
