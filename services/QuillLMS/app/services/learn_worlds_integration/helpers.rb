# frozen_string_literal: true

module LearnWorldsIntegration
  module Helpers
    def self.to_username(str) = str.downcase.strip.gsub(/\s/, '.')
  end
end
