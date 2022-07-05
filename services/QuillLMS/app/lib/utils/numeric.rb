# frozen_string_literal: true

module Utils::Numeric
  def self.to_human_string(numeric)
    numeric = numeric.to_f

    millions = ->(x) { x >= 1_000_000 && x < 1_000_000_000 }
    billions = ->(x) { x >= 1_000_000_000 }

    case numeric
    when millions
      "#{(numeric / 1_000_000).round} Million"
    when billions
      "#{(numeric / 1_000_000_000).round} Billion"
    else
      numeric.to_s
    end
  end
end
