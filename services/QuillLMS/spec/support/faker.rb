# frozen_string_literal: true

module Faker
  class Name
    def self.custom_name
      [first_name, last_name].join(' ')
    end
  end
end
