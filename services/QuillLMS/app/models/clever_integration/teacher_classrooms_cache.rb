# frozen_string_literal: true

module CleverIntegration
  class TeacherClassroomsCache
    CACHE_NAMESPACE = 'SERIALIZED_CLEVER_CLASSROOMS'
    CACHE_LIFE = 300

    def self.read(teacher_id)
      Rails.cache.read(teacher_id, namespace: CACHE_NAMESPACE)
    end

    def self.delete(teacher_id)
      Rails.cache.delete(teacher_id, namespace: CACHE_NAMESPACE)
    end

    def self.write(teacher_id, data, expires_in=CACHE_LIFE)
      Rails.cache.write(teacher_id, data, expires_in: expires_in, namespace: CACHE_NAMESPACE)
    end
  end
end
