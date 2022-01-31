# frozen_string_literal: true

class GenerateUsername < ApplicationService
  MAX_LOOPS = 1_000

  def initialize(first_name, last_name, classcode = nil)
    @first_name = first_name
    @last_name = last_name
    @classcode = classcode
  end

  def run
    generate
  end

  attr_reader :first_name, :last_name, :classcode
  private :first_name
  private :last_name
  private :classcode

  # NB, This will produce and invalid username if there are
  # more than 1,000 (MAX_LOOPS) students in a class
  # with the same first and last names. Putting in place to prevent a never-ending loop
  private def generate
    name_string = "#{first_name}.#{last_name}".downcase
    at_classcode = at_classcode(classcode)

    username = "#{name_string}#{at_classcode}"
    count = 1

    while User.where(username: username).exists? && count < MAX_LOOPS
      username = "#{name_string}#{count}#{at_classcode}"
      count += 1
    end

    username
  end

  private def at_classcode(classcode)
    return "" if classcode.nil?

    "@#{classcode}"
  end
end
