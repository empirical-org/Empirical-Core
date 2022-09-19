# frozen_string_literal: true

module Units::Updater
  # in this file, 'unit' refers to a unit object, 'activities_data' to an array of objects
  # with activity ids and due_dates, and 'classrooms_data' to an array of objects with an id
  # and array of student ids.

  # TODO: rename this -- it isn't always the method called on the instance
  def self.run(unit_id, activities_data, classrooms_data, current_user_id=nil)
    update_helper(unit_id, activities_data, classrooms_data, current_user_id)
  end

  def self.assign_unit_template_to_one_class(unit_id, classrooms_data, unit_template_id, current_user_id=nil, concatenate_existing_student_ids: false)
    activities_data = UnitTemplate.find(unit_template_id).activities.map { |a| {id: a.id, due_date: nil} }
    update_helper(unit_id, activities_data, [classrooms_data], current_user_id, concatenate_existing_student_ids: concatenate_existing_student_ids)
  end

  def self.fast_assign_unit_template(teacher_id, unit_template, unit_id, current_user_id=nil)
    activities_data = unit_template.activities.pluck(:id).map { |activity_id| { id: activity_id, due_date: nil } }
    classrooms_data = User.find(teacher_id).classrooms_i_teach.map { |classroom| {id: classroom.id, student_ids: [], assign_on_join: true } }
    update_helper(unit_id, activities_data, classrooms_data, current_user_id || teacher_id)
  end

  def self.update_helper(unit_id, activities_data, classrooms_data, current_user_id, concatenate_existing_student_ids: false)
    ClassroomUnitsSaver.run(classrooms_data, concatenate_existing_student_ids, unit_id)
    UnitActivitiesSaver.run(activities_data, unit_id)

    unit = Unit.find(unit_id)
    unit.save
    unit.hide_if_no_visible_unit_activities
    AssignActivityWorker.perform_async(current_user_id, unit_id)
  end
end
