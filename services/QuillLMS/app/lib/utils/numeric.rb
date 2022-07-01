# frozen_string_literal: true

module Utils::Numeric
  def self.to_human_string(numeric)
    raise ArgumentError, "Not a numeric" unless numeric.is_a?(Numeric)

    millions = ->(x) { x >= 1_000_000 && x < 1_000_000_000 }
    billions = ->(x) { x >= 1_000_000_000 }

    case numeric
    when millions
      "#{(numeric.to_f / 1_000_000).round} Million"
    when billions
      "#{(numeric.to_f / 1_000_000_000).round} Billion"
    else
      numeric.to_s
    end
  end
end
