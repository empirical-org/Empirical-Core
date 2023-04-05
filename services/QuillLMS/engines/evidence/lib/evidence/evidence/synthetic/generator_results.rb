# frozen_string_literal: true

module Evidence
  module Synthetic
    GeneratorResults = Struct.new(:generator, :results, keyword_init: true)
  end
end
