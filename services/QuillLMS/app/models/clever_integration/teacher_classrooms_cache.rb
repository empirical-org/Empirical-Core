# frozen_string_literal: true

module CleverIntegration
  class TeacherClassroomsCache
    CACHE_KEY_PREFIX = 'SERIALIZED_CLEVER_CLASSROOMS_FOR_'
    CACHE_LIFE = 300

    def self.cache_key(teacher_id)
      "#{CACHE_KEY_PREFIX}#{teacher_id}"
    end

    def self.get(teacher_id)
      $redis.get(cache_key(teacher_id))
    end

    def self.expire(teacher_id, expires_in=CACHE_LIFE)
      $redis.expire(cache_key(teacher_id), expires_in)
    end

    def self.del(teacher_id)
      $redis.del(cache_key(teacher_id))
    end

    def self.set(teacher_id, data)
      $redis.set(cache_key(teacher_id), data)
    end

    def self.get_data(teacher_id)
      JSON.parse(get(teacher_id))
    end
  end
end
