module GoogleIntegration
  class TeacherClassroomsCache
    SERIALIZED_GOOGLE_CLASSROOMS_FOR_ = 'SERIALIZED_GOOGLE_CLASSROOMS_FOR_'.freeze
    SERIALIZED_GOOGLE_CLASSROOMS_CACHE_LIFE = 300

    def self.cache_key(teacher_id)
      "#{SERIALIZED_GOOGLE_CLASSROOMS_FOR_}#{teacher_id}"
    end

    def self.get(teacher_id)
      $redis.get(cache_key(teacher_id))
    end

    def self.expire(teacher_id, expires_in=SERIALIZED_GOOGLE_CLASSROOMS_CACHE_LIFE)
      $redis.expire(cache_key(teacher_id), expires_in)
    end

    def self.del(teacher_id)
      $redis.del(cache_key(teacher_id))
    end

    def self.set(teacher_id, data)
      $redis.set(cache_key(teacher_id), data)
    end
  end
end
