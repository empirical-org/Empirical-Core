# frozen_string_literal: true

module VitallyIntegration
  class CacheVitallySchoolData
    def self.cache_key(school_id, year)
      "school_id:#{school_id}_vitally_stats_for_year_#{year}"
    end

    def self.get(school_id, year)
      Rails.cache.read(cache_key(school_id, year))
    end

    def self.del(school_id, year)
      Rails.cache.delete(cache_key(school_id, year))
    end

    def self.set(school_id, year, data)
      Rails.cache.write(cache_key(school_id, year), data, {ex: 1.year})
    end
  end
end
