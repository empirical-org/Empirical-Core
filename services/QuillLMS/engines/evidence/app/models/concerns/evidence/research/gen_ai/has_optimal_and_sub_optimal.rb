# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module HasOptimalAndSubOptimal
        extend ActiveSupport::Concern

        OPTIMAL_PREFIXES = [
          'Nice work',
          'Good job',
          'Great job',
          'Excellent job'
        ].freeze

        def optimal? = OPTIMAL_PREFIXES.any? { |prefix| text.downcase.strip.start_with?(prefix.downcase.strip) }

        def sub_optimal? = !optimal?
      end
    end
  end
end