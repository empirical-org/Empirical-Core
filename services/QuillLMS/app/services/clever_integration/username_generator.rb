# frozen_string_literal: true

module CleverIntegration
  class UsernameGenerator < ApplicationService
    attr_reader :first_name, :last_name

    def initialize(name)
      @first_name = name.to_s.split[0]
      @last_name = name.to_s.split[-1]
    end

    def run
      ::GenerateUsername.run(first_name, last_name)
    end
  end
end
