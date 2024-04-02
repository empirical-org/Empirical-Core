# frozen_string_literal: true

class DiagnosticUnitRecordsFetcher < ApplicationService
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def run
    diagnostic_activity_ids = ActivityClassification.find_by_key('diagnostic').activity_ids
    records = ClassroomsTeacher.select("
      classrooms.name AS classroom_name,
      activities.name AS activity_name,
      activities.id AS activity_id,
      classroom_units.unit_id AS unit_id,
      units.name AS unit_name,
      classrooms.id AS classroom_id,
      classroom_units.assigned_student_ids AS assigned_student_ids,
      greatest(unit_activities.created_at, classroom_units.created_at) AS assigned_date,
      activities.follow_up_activity_id AS post_test_id,
      classroom_units.id AS classroom_unit_id,
      activities_unit_templates.unit_template_id AS unit_template_id
    ")
    .joins("JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id AND classrooms.visible = TRUE AND classrooms_teachers.user_id = #{user.id}")
    .joins("JOIN classroom_units ON classroom_units.classroom_id = classrooms.id AND classroom_units.visible")
    .joins("JOIN units ON classroom_units.unit_id = units.id AND units.visible")
    .joins("JOIN unit_activities ON unit_activities.unit_id = classroom_units.unit_id AND unit_activities.activity_id IN (#{diagnostic_activity_ids.join(',')}) AND unit_activities.visible")
    .joins("JOIN activities ON unit_activities.activity_id = activities.id")
    .joins("LEFT JOIN activities_unit_templates ON activities_unit_templates.activity_id = activities.id")
    .group("classrooms.name, activities.name, activities.id, classroom_units.unit_id, classroom_units.id, units.name, classrooms.id, classroom_units.assigned_student_ids, unit_activities.created_at, classroom_units.created_at, activities_unit_templates.unit_template_id")
    .order(Arel.sql("classrooms.name, greatest(classroom_units.created_at, unit_activities.created_at) DESC"))

    records.map do |r|
      {
        "assigned_student_ids" => r['assigned_student_ids'] || [],
        "classroom_name" => r['classroom_name'],
        "activity_name" => r['activity_name'],
        "activity_id" => r['activity_id'],
        "unit_id" => r['unit_id'],
        "unit_name" => r['unit_name'],
        "classroom_id" => r['classroom_id'],
        "assigned_date" => r['assigned_date'],
        "post_test_id" => r['post_test_id'],
        "classroom_unit_id" => r['classroom_unit_id'],
        "unit_template_id" => r['unit_template_id']
      }
    end
  end
end
