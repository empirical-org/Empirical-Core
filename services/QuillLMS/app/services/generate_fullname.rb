# frozen_string_literal: true

class GenerateFullname < ApplicationService
  DEFAULT_NAME = 'Firstname Lastname'
  def initialize(name)
    @name = name
  end

  def run
    generate_fullname
  end

  attr_reader :name
  private :name

  private def generate_fullname
    first_name, last_name = SplitName.run(name)

    return name unless last_name.nil?

    first_name.present? ? "#{first_name} #{first_name}" : DEFAULT_NAME
  end
end
