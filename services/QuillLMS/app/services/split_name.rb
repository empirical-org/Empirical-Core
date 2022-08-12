# frozen_string_literal: true

class SplitName < ApplicationService
  def initialize(name)
    @name = name
  end

  def run
    split_name
  end

  attr_reader :name
  private :name

  private def split_name
    return [nil, nil] if name.nil?

    first_name, last_name = name.strip.try(:split, /\s+/, 2)
    [first_name, last_name]
  end
end
