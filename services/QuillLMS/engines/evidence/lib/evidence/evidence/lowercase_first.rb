# frozen_string_literal: true

module Evidence
  class LowercaseFirst
    attr_reader :custom_word_list

    COMMON_WORD_LIST = Evidence::Configs.from_yml(:common_lowercase_words)
    BLANK = ' '

    def initialize(custom_word_list)
      @custom_word_list = custom_word_list&.map(&:downcase)
    end

    def word_list
      @word_list ||= (COMMON_WORD_LIST + (custom_word_list || [])).to_set
    end

    def run(text)
      first_in_word_list(text) ? downcase_first_letter(text) : text
    end

    private def first_in_word_list(text)
      word = text.split(BLANK)&.first&.downcase

      word.in?(word_list)
    end

    private def downcase_first_letter(text)
      text.sub(text[0], text[0].downcase)
    end
  end
end
