# frozen_string_literal: true

module OpenAI
  class SaveTranslatedTexts < ApplicationService

    attr_accessor :english_texts

    def initialize(english_texts)
      @english_texts = english_texts
    end

    def run
      english_texts.each{|text| TranslateAndSaveText.run(text)}
    end

  end
end
