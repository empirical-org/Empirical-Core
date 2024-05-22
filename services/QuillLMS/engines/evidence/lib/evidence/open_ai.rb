# frozen_string_literal: true

module Evidence
  module OpenAI
    API_KEY = ENV['OPENAI_API_KEY']
    MAX_COUNT = 128 # API has an undocumented max of 128 for 'n'
    PARAPHRASE_INSTRUCTION = "rephrase with some synonyms:\n\n"
  end
end
