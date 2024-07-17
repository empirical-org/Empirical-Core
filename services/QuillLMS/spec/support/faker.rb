# frozen_string_literal: true

module Faker
  class Name
    CUSTOM_FIRST_NAMES = %w[
      Van
      Maria
    ].freeze

    CUSTOM_LAST_NAMES = [
      'Johsnon',
      'von Trapp'
    ].freeze

    def self.custom_name = "#{custom_first_name} #{custom_last_name}"
    def self.custom_first_name = CUSTOM_FIRST_NAMES.sample
    def self.custom_last_name = CUSTOM_LAST_NAMES.sample
  end
end
