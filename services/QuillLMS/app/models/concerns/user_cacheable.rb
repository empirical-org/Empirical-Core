# frozen_string_literal: true

# This is a Mixin for the User class to cache objects for a user
# Used to define common cache_keys in the app and force a common pattern
# To add caching to a controller, use one of the public methods here. They have been tested
# for proper cache expiration (using `touch` and updated_at changes)

# Sample Controller Usage
# response = user.classroom_unit_cache(classroom_unit: classroom_unit, key: 'controller.method') do
#   # some expensive action to cache that only needs to update
#   # when a classroom_unit or its children change
# end
# render json: response
module UserCacheable
  extend ActiveSupport::Concern

  def all_classrooms_cache(key:, groups: {})
    classroom = last_updated_classroom

    model_cache(classroom, key: key, groups: groups) { yield }
  end

  def classroom_cache(classroom:, key:, groups: {})
    model_cache(classroom, key: key, groups: groups) { yield }
  end

  def classroom_unit_cache(classroom_unit:, key:, groups: {})
    model_cache(classroom_unit, key: key, groups: groups) { yield }
  end

  def classroom_unit_by_ids_cache(classroom_id:, unit_id:, activity_id:, key:, groups: {})
    classroom_unit = if unit_id
      ClassroomUnit.find_by(unit_id: unit_id, classroom_id: classroom_id)
    else
      # use maximium updated_at of these classroom_units
      ClassroomUnit.where(classroom_id: classroom_id)
        .joins(:unit, :unit_activities)
        .where(unit: {unit_activities: {activity_id: activity_id}})
        .maximum('classroom_units.updated_at')
    end

    model_cache(classroom_unit, key: key, groups: groups) { yield }
  end

  private def model_cache_key(object, key:, groups:)
    group_array = groups.to_a.sort_by(&:first).flatten

    [key, *group_array, object]
  end

  # note: object for caching defaults to the user to avoid nil cache keys shared by different people
  private def model_cache(object, key:, groups:)
    Rails.cache.fetch(model_cache_key(object || self, key: key, groups: groups)) do
      yield
    end
  end

  private def last_updated_classroom
    Classroom
      .select("classrooms.*, MAX(classrooms.updated_at)")
      .unscoped
      .joins(:classrooms_teachers)
      .where(classrooms_teachers: {user_id: id})
      .first
  end
end
