# frozen_string_literal: true

class DuplicateNameResolver < ApplicationService
  attr_reader :name, :existing_names, :max_before_randomized

  MAX_BEFORE_RANDOMIZED = 10

  def initialize(name, existing_names, max_before_randomized=MAX_BEFORE_RANDOMIZED)
    @name = name
    @existing_names = existing_names
    @max_before_randomized = max_before_randomized
  end

  def run
    original_name || name_with_increment || name_with_random_string
  end

  private def name_with_increment
    1.upto(max_before_randomized) do |n|
      temp_name = name + "_#{n}"
      return temp_name unless existing_names.include?(temp_name)
    end
  end

  private def original_name
    return name unless existing_names.include?(name)
  end

  private def name_with_random_string
    "#{name}-#{SecureRandom.urlsafe_base64}"
  end
end
