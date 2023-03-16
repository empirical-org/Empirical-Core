# frozen_string_literal: true

module Evidence
  module Synthetic
    Generator = Struct.new(:name, :source_text, :results, :language, :word, :word_list, :ml_prompt,:temperature, :count, :index, keyword_init: true)
  end
end
