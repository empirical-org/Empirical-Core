class CacheVitallySchoolData

  def self.cache_key(school_id, year)
    "school_id:#{school_id}_vitally_stats_for_year_#{year}"
  end

  def self.get(school_id, year)
    $redis.get(cache_key(school_id, year))
  end

  def self.del(school_id, year)
    $redis.del(cache_key(school_id, year))
  end

  def self.set(school_id, year, data)
    $redis.set(cache_key(school_id, year), data, {ex: 1.year})
  end
end
