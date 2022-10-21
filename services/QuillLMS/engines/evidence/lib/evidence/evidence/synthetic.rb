# frozen_string_literal: true

module Evidence
  module Synthetic
    EMAIL = ENV.fetch('SYNTHETIC_DATA_EMAIL', '')

    SeedLabelConfig = Struct.new(:label, :examples, keyword_init: true)
  end
end
