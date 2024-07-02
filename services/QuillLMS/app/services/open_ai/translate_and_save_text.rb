# frozen_string_literal: true

module OpenAI
  class TranslateAndSaveText < ApplicationService

    class OpenAITranslationError < StandardError; end
    attr_reader :english_text, :locale, :prompt

    def initialize(english_text, locale: Translatable::DEFAULT_LOCALE, prompt:)
      @english_text = english_text
      @locale = locale
      @prompt = prompt
    end

    def run
      raise OpenAITranslationError unless response.present?

      translated_text.update(translation: response)
    end

    private def response = @response ||= Translate.run(english_text: english_text.text, prompt:)
    private def source_api = Translatable::OPEN_AI_SOURCE
    private def translated_text = @translated_text || TranslatedText.find_or_initialize_by(english_text:, locale:, source_api:)
  end
end
