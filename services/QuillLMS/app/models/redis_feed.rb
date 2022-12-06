# frozen_string_literal: true

# Intended to be subclassed.
# RedisFeed allows an limited array of ids to be stored in redis
# And those ids to be retrieved and converted to objects via a hydrate method
# Usage:
# Implemement subclass: SomeActivityFeed < RedisFeed
# Add item: SomeActivityFeed.add(teacher_id, some_activity_identifier)
# Retrieve objects: SomeActivityFeed.get(teacher_id) -> returns array of hash objects
# Subclasses need to implement:
# Required: key, limit, hydrate(ids:)
# Optional: callback_on_add(id)

class RedisFeed
  attr_reader :redis_key, :key_id

  class NotImplementedError < StandardError; end

  def initialize(key_id)
    @key_id = key_id
    @redis_key = "#{key}#{key_id}"
  end

  def self.add(key_id, id_or_ids)
    new(key_id).add(id_or_ids)
  end

  def self.get(key_id)
    feed = new(key_id)
    feed.hydrate(ids: feed.ids)
  end

  def self.reset!(key_id)
    new(key_id).reset!
  end

  # add identifiers to a redis array, limit to a certain size
  # takes a stringy identifier or an array or stringy identifiers
  # e.g. add(1), add("2"), add([1,2,3])
  # add([1,2,3]) will result in 1 as the first element, 2 as the second, 3 as the third
  def add(id_or_ids)
    # reversing array to main order as pushed into redis (last is pushed on first)
    # See: https://redis.io/commands/lpush
    Array(id_or_ids).reverse.each do |id|
      $redis.lpush(redis_key, id)
      callback_on_add(id)
    end
    $redis.ltrim(redis_key, 0, limit - 1)
  end

  # returns an array of strings
  def ids
    $redis.lrange(redis_key, 0, limit - 1)
  end

  def reset!
    temp_ids = ids
    $redis.del(redis_key)
    temp_ids
  end

  # Methods defined by subclass
  def key
    raise NotImplementedError
  end

  # should return an array of hash objects
  def hydrate(ids:)
    raise NotImplementedError
  end

  def limit
    raise NotImplementedError
  end

  # should handle a single id
  def callback_on_add(id)
    # Can be optionally defined by subclass
  end

  # used for testing
  private def delete_all
    $redis.del(redis_key)
  end
end
