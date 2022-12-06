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

  def self.seconds_to_human_readable_time(seconds)
    format("%<minutes>02d:%<seconds>02d", minutes: seconds / 60 % 60, seconds: seconds % 60)
  end

  # time must be in the format "MM:SS"
  def self.human_readable_time_to_seconds(time)
    (time.split(":")[0].to_i * 60) + (time.split(":")[1].to_i)
  end
end
