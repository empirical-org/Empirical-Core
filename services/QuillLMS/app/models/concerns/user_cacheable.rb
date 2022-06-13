# frozen_string_literal: true

# This is a Mixin for the User class to cache objects for a user
# Also defines common cache_keys in the app and forces a common pattern
# To add caching to a controller, use one of the public methods here.
# They have been tested for proper cache expiration
# (using `touch` and `updated_at` changes)

# Note, this is in the User since for nil objects we'd want to avoid sharing caches between users
# So, defaulting to the user object as a cache key to avoid that.

# Sample Controller Usage
# response = user.classroom_unit_cache(classroom_unit, key: 'controller.method') do
#   # some expensive action to cache that only needs to update
#   # when a classroom_unit or its children change
# end
# render json: response
module UserCacheable
  extend ActiveSupport::Concern

  DEFAULT_EXPIRATION = 24.hours

  def all_classrooms_cache(key:, groups: {}, expires_in: DEFAULT_EXPIRATION, &block)
    model_cache(last_updated_classroom, key: key, groups: groups, expires_in: expires_in, &block)
  end

  def classroom_cache(classroom, key:, groups: {}, expires_in: DEFAULT_EXPIRATION, &block)
    model_cache(classroom, key: key, groups: groups, expires_in: expires_in, &block)
  end

  def classroom_unit_cache(classroom_unit, key:, groups: {}, expires_in: DEFAULT_EXPIRATION, &block)
    model_cache(classroom_unit, key: key, groups: groups, expires_in: expires_in, &block)
  end

  def classroom_unit_by_ids_cache(classroom_id:, unit_id:, activity_id:, key:, groups: {}, expires_in: DEFAULT_EXPIRATION, &block)
    classroom_unit = classroom_unit_for_ids(classroom_id: classroom_id, unit_id: unit_id, activity_id: activity_id)

    model_cache(classroom_unit, key: key, groups: groups, expires_in: expires_in, &block)
  end

  # NOTE: object for caching defaults to the 'user'
  # This avoids nil cache keys shared by different users
  private def model_cache_key(object, key:, groups:)
    group_array = groups.to_a.sort_by(&:first).flatten

    [key, *group_array, object || self]
  end

  private def model_cache(object, key:, groups:, expires_in: DEFAULT_EXPIRATION, &block)
    raise LocalJumpError unless block_given?

    Rails.cache.fetch(model_cache_key(object, key: key, groups: groups), expires_in: expires_in, &block)
  end

  private def last_updated_classroom
    Classroom
      .select("classrooms.*, MAX(classrooms.updated_at)")
      .unscoped
      .joins(:classrooms_teachers)
      .where(classrooms_teachers: {user_id: id})
      .order(updated_at: :desc)
      .first
  end

  private def classroom_unit_for_ids(classroom_id:, unit_id:, activity_id:)
    if unit_id
      return ClassroomUnit.find_by(unit_id: unit_id, classroom_id: classroom_id)
    end

    # use ClassroomUnit with the maximium `updated_at`
    ClassroomUnit
      .select("classroom_units.*, MAX(classroom_units.updated_at)")
      .unscoped
      .where(classroom_id: classroom_id)
      .joins(:unit_activities)
      .where(unit: {unit_activities: {activity_id: activity_id}})
      .order("classroom_units.updated_at DESC")
      .group("classroom_units.id")
      .first
  end
end
