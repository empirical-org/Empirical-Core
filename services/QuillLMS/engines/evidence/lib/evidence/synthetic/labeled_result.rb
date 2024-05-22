# frozen_string_literal: true

module Evidence
  module Synthetic
    LabeledResult = Struct.new(:text, :label, :type, :generated, keyword_init: true)
  end
end
