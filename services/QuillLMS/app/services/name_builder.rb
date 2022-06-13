# frozen_string_literal: true

class NameBuilder < ApplicationService
  def initialize(first_name, last_name)
    @first_name = first_name
    @last_name  = last_name
  end

  def run
    joined_first_name = first_name.blank? ? 'Firstname' : first_name.capitalize
    joined_last_name  = last_name.blank?  ? 'Lastname'  : last_name.capitalize

    "#{joined_first_name} #{joined_last_name}"
  end

  attr_accessor :first_name, :last_name
  private :first_name
  private :last_name
end
