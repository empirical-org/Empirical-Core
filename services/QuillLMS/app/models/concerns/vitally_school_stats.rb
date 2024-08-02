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
      .where(state: 'finished').where('schools.id = ?', school.id)
  end

  private def activities_finished_query
    ClassroomsTeacher.joins(user: { schools_users: :school }, classroom: [ { classroom_units: { unit_activities: :activity } }, { classroom_units: :activity_sessions } ])
      .where('schools.id = ?', school.id)
      .where('activity_sessions.state = ?', 'finished')
  end

  def activities_assigned_query
    ClassroomUnit.joins(classroom: { teachers: :school }, unit: :activities)
      .where('schools.id = ?', school.id)
      .select('assigned_student_ids', 'activities.id', 'unit_activities.created_at')
  end
end
