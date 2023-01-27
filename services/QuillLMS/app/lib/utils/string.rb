# frozen_string_literal: true

module Utils::String
  def self.last_name_or_name(first_name_last_name_string)
    raise ArgumentError, 'Arg must respond to split' unless first_name_last_name_string.respond_to?(:split)

    first, last = first_name_last_name_string.split
    last || first
  end
end
