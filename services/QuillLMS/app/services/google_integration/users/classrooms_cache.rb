module GoogleIntegration
  module Users
    class ClassroomsCache
      SERIALIZED_GOOGLE_CLASSROOMS_FOR_ = 'SERIALIZED_GOOGLE_CLASSROOMS_FOR_'.freeze
      SERIALIZED_GOOGLE_CLASSROOMS_CACHE_LIFE = 60

      def self.cache_key(user_id)
        "#{SERIALIZED_GOOGLE_CLASSROOMS_FOR_}#{user_id}"
      end

      def self.get(user_id)
        $redis.get(cache_key(user_id))
      end

      def self.expire(user_id, expires_in=SERIALIZED_GOOGLE_CLASSROOMS_CACHE_LIFE)
        $redis.expire(cache_key(user_id), expires_in)
      end

      def self.del(user_id)
        $redis.del(cache_key(user_id))
      end

      def self.set(user_id, data)
        $redis.set(cache_key(user_id), data)
      end
    end
  end
end
