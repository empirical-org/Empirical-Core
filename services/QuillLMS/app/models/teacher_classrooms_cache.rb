# frozen_string_literal: true

class TeacherClassroomsCache
  CACHE_LIFE = 300

  def self.read(teacher_id)
    Rails.cache.read(teacher_id, namespace: self::CACHE_NAMESPACE)
  end

  def self.delete(teacher_id)
    Rails.cache.delete(teacher_id, namespace: self::CACHE_NAMESPACE)
  end

  def self.write(teacher_id, data, expires_in=CACHE_LIFE)
    Rails.cache.write(teacher_id, data, expires_in: expires_in, namespace: self::CACHE_NAMESPACE)
  end
end
