module Feature
  SECONDS_PER_DAY = 24 * 60 * 60

  # pass a unique id
  def self.in_day_bucket?(id:, percent_per_day:)
    mod_base = (100.0/percent_per_day).to_i

    day_since_epoch = Time.zone.now.to_i / SECONDS_PER_DAY

    id % mod_base == day_since_epoch % mod_base
  end
end