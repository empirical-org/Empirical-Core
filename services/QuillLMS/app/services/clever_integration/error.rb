# frozen_string_literal: true

module CleverIntegration
  class Error < StandardError
    def message
      self.class::MESSAGE
    end
  end
end
