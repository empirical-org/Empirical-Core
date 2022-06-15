module Utils::Integer
  def self.to_human_string(int)
    raise ArgumentError unless int.class == Integer

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