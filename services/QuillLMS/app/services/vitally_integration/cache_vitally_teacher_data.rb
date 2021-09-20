class CacheVitallyTeacherData

  def self.cache_key(teacher_id, year)
    "teacher_id:#{teacher_id}_vitally_stats_for_year_#{year}"
  end

  def self.get(teacher_id, year)
    $redis.get(cache_key(teacher_id, year))
  end

  def self.del(teacher_id, year)
    $redis.del(cache_key(teacher_id, year))
  end

  def self.set(teacher_id, year, data)
    $redis.set(cache_key(teacher_id, year), data, {ex: 1.year})
  end
end
