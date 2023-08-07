# frozen_string_literal: true

module VitallyIntegration
  class CacheVitallyTeacherData
    EXPIRATION = 1.year

    def self.cache_key(teacher_id, year)
      "teacher_id:#{teacher_id}_vitally_stats_for_year_#{year}"
    end

    def self.get(teacher_id, year)
      Rails.cache.read(cache_key(teacher_id, year))
    end

    def self.del(teacher_id, year)
      Rails.cache.delete(cache_key(teacher_id, year))
    end

    def self.set(teacher_id, year, data)
      Rails.cache.write(cache_key(teacher_id, year), data, expires_in: EXPIRATION)
    end
  end
end
