# frozen_string_literal: true

module VitallySchoolStats
  extend ActiveSupport::Concern

  attr_reader :school

  private def active_students_query
    # use raw SQL to bypass scope limits (visible: true) on classrooms
    ActivitySession.unscoped.select(:user_id)
      .distinct
      .joins('JOIN classroom_units on classroom_units.id=activity_sessions.classroom_unit_id')
      .joins('JOIN classrooms ON classrooms.id=classroom_units.classroom_id')
      .joins('JOIN classrooms_teachers ON classrooms_teachers.classroom_id=classrooms.id')
      .joins('JOIN schools_users ON schools_users.user_id = classrooms_teachers.user_id')
      .joins('JOIN schools ON schools_users.school_id=schools.id')
      .where(state: 'finished')
      .where('classrooms_teachers.role = ?', ClassroomsTeacher::ROLE_TYPES[:owner])
      .where('schools.id = ?', school.id)
  end

  private def activities_finished_query
    @activities_finished ||= ActivitySession.unscoped.select(:id).distinct
      .joins(classroom_unit: { classroom_unscoped: { classrooms_teachers: { user: :schools_users } } })
      .joins(:activity)
      .where(state: 'finished')
      .where('classrooms_teachers.role = ?', ClassroomsTeacher::ROLE_TYPES[:owner])
      .where('schools_users.school_id = ?', school.id)
  end

  def activities_assigned_query
    @activities_assigned ||= ClassroomUnit.joins(classroom_unscoped: { teachers: :school })
      .joins('JOIN units on classroom_units.unit_id = units.id')
      .joins('JOIN unit_activities on unit_activities.unit_id = units.id')
      .joins('JOIN activities ON unit_activities.activity_id = activities.id')
      .where('schools.id = ?', school.id)
      .where('classrooms_teachers.role = ?', ClassroomsTeacher::ROLE_TYPES[:owner])
      .select('assigned_student_ids', 'activities.id', 'classroom_units.created_at')
  end
end
