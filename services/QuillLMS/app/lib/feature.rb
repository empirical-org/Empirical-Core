# frozen_string_literal: true

module Feature
  SECONDS_PER_DAY = 24 * 60 * 60

  # pass a unique id
  def self.in_day_bucket?(id:, percent_per_day:)
    safe_percent_per_day = percent_per_day.to_f.zero? ? 1.0 : percent_per_day.to_f
    mod_base = 100.0/safe_percent_per_day

    day_since_epoch = Time.current.to_i / SECONDS_PER_DAY

    id % mod_base == day_since_epoch % mod_base
  end
end
