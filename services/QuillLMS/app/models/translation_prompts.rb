# frozen_string_literal: true

class TranslationPrompts
  def self.prompt_start(locale:)
    <<~STRING
      You are going to do a translation from english to #{locale} using simple words and language at a 5th grade reading level. Use shorter words over longer if possible. The tone should be somewhat casual. Return just the translated text preserving (but not translating) the HTML.

      We are translating the instructions and feedback for an English-language grammar activity. The content of the activity itself is not translated.

    STRING
  end

  def self.feedback_strings_custom_prompt
    <<~STRING
      Following is the text to translate in a JSON format. Please return JSON in the same format, with the values translated but not the keys.

      JSON Text:

    STRING
  end

  def self.feedback_strings_prompt(locale:)
    prompt_start(locale:) + feedback_strings_custom_prompt
  end
end
