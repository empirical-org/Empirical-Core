# frozen_string_literal: true

module Utils::Numeric
  def self.to_human_string(int)
    raise ArgumentError, "Not a numeric" unless int.is_a?(Numeric)

    millions = lambda {|x| x >= 1_000_000 && x < 1_000_000_000 }
    billions = lambda {|x| x >= 1_000_000_000 }

    case int
    when millions
      "#{(int.to_f / 1_000_000).round} Million"
    when billions
      "#{(int.to_f / 1_000_000_000).round} Billion"
    else
      int.to_s
    end
  end
end
