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

    return "#{first_name} #{first_name}" if last_name.nil? && first_name.present?
    return DEFAULT_NAME if last_name.nil? && first_name.nil?

    name
  end
end
