# frozen_string_literal: true

module OpenAI
  class SaveTranslatedText < ApplicationService

    class OpenAITranslationError < StandardError; end
    attr_accessor :english_text

    def initialize(english_text)
      @english_text = english_text
    end

    def run
      raise OpenAITranslationError unless response.present?

      translated_text.update(translation: response)
    end

    private def response = @response ||= Translate.run(english_text: english_text.text)

    private def translated_text
      @translated_text ||= TranslatedText.find_or_initialize_by(
        english_text_id: english_text.id,
        locale: Gengo::SPANISH_LOCALE
      )
    end
  end
end
