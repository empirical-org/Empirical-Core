# Used to define common cache_keys in the app and force a common pattern
module CacheKey

  def self.all_classrooms(user, name:, groups: [])
    classroom = user.classrooms_i_teach.maximum('classrooms.updated_at')

    model_key(classroom, name: name, groups: groups)]
  end

  def self.classroom(classroom, name:, groups: [])
    model_key(classroom, name: name, groups: groups)
  end

  def self.classroom_unit(classroom_unit, name:, groups: [])
    model_key(classroom_unit, name: name, groups: groups)
  end

  def self.classroom_unit_by_ids(classroom_id:, unit_id:, activity_id:, name:, groups: []])
    classroom_unit = if unit_id
      ClassroomUnit.find_by(unit_id: unit_id, classroom_id: classroom_id)
    else
      # use maximium updated_at of these classroom_units
      ClassroomUnit.where(classroom_id: classroom_id)
        .joins(:unit, :unit_activities)
        .where(unit: {unit_activities: {activity_id: activity_id}})
        .maximum('classroom_units.updated_at')
    end

    model_key(classroom_unit, name: name, groups: groups)
  end

  private self.model_key(object, name:, groups: [])
    [name, *groups, object]
  end

end
