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

  class NotImplementedError < StandardError; end;

  def initialize(key_id)
    @key_id = key_id
    @redis_key = "#{key}#{key_id}"
  end

  def self.add(key_id, id)
    new(key_id).add(id)
  end

  def self.get(key_id)
    feed = new(key_id)
    feed.hydrate(ids: feed.ids)
  end

  # add identifiers to a redis array, limit to a certain size
  def add(id)
    $redis.lpush(redis_key, id)
    $redis.ltrim(redis_key, 0, limit)
    callback_on_add(id)
  end

  def ids
    $redis.lrange(redis_key, 0, limit)
  end

  # Methods defined by subclass
  def key
    raise NotImplementedError.new
  end

  # should return an array of hash objects
  def hydrate(ids:)
    raise NotImplementedError.new
  end

  def limit
    raise NotImplementedError.new
  end

  def callback_on_add(id)
    # Can be optionally defined by subclass
  end
end
