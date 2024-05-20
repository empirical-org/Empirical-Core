# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class HistogramBuilder < ApplicationService
        attr_reader :scores

        def initialize(scores:)
          @scores = scores
        end

        def run
          Hash.new(0).tap do |histogram|
            scores.each { |score| histogram[[score.round]] += 1 }
          end
        end
      end
    end
  end
end
