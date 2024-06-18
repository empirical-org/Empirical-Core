# frozen_string_literal: true

module VitallySchoolStats
  extend ActiveSupport::Concern

  private def active_students_query(school)
    # use raw SQL to bypass scope limits (visible: true) on classrooms
    ActivitySession.unscoped.select(:user_id)
      .distinct
      .joins("JOIN classroom_units on classroom_units.id=activity_sessions.classroom_unit_id")
      .joins("JOIN classrooms ON classrooms.id=classroom_units.classroom_id")
      .joins("JOIN classrooms_teachers ON classrooms_teachers.classroom_id=classrooms.id")
      .joins("JOIN schools_users ON schools_users.user_id = classrooms_teachers.user_id")
      .joins("JOIN schools ON schools_users.school_id=schools.id")
      .where(state: 'finished').where('schools.id = ?', school.id)
  end

  private def activities_finished_query(school)
    ClassroomsTeacher.joins("JOIN users ON users.id=classrooms_teachers.user_id")
      .joins("JOIN schools_users ON schools_users.user_id=users.id")
      .joins("JOIN schools ON schools.id=schools_users.school_id")
      .joins("JOIN classrooms ON classrooms.id=classrooms_teachers.classroom_id")
      .joins("JOIN classroom_units ON classroom_units.classroom_id=classrooms.id")
      .joins("JOIN activity_sessions ON activity_sessions.classroom_unit_id=classroom_units.id")
      .joins("JOIN activities ON activity_sessions.activity_id = activities.id")
      .where('schools.id = ?', school.id)
      .where('activity_sessions.state = ?', 'finished')
  end

  def activities_per_student(active_students, activities_finished)
    if active_students > 0
      (activities_finished.to_f / active_students).round(2)
    else
      0
    end
  end

  def sum_students(activities)
    activities.map { |r| r&.assigned_student_ids&.count || 0 }.sum
  end

  def filter_evidence(activities)
    evidence_ids = Activity.where(activity_classification_id: evidence_id).pluck(:id)
    activities.select {|r| evidence_ids.include?(r.id) }
  end

  def evidence_id
    ActivityClassification.evidence.id
  end

  def in_school_year(activities, school_year_start, school_year_end)
    activities.select {|r| r.created_at >= school_year_start && r.created_at < school_year_end }
  end

  def activities_assigned_query(school)
    ClassroomUnit.joins("JOIN unit_activities ON classroom_units.unit_id=unit_activities.unit_id")
    .joins("JOIN activities ON activities.id = unit_activities.activity_id")
    .joins("JOIN classrooms ON classrooms.id = classroom_units.classroom_id")
    .joins("JOIN classrooms_teachers ON classrooms.id=classrooms_teachers.classroom_id")
    .joins("JOIN schools_users ON schools_users.user_id = classrooms_teachers.user_id")
    .joins("JOIN schools ON schools_users.school_id=schools.id")
    .where("schools.id = ?", school.id)
    .select("assigned_student_ids, activities.id, unit_activities.created_at")
  end

  def evidence_assigned_in_year_count(school, school_year_start, school_year_end)
    sum_students(filter_evidence(in_school_year(activities_assigned_query(school), school_year_start, school_year_end)))
  end

  private def evidence_assigned_count(school)
    sum_students(filter_evidence(activities_assigned_query(school)))
  end

  private def evidence_finished(school)
    activities_finished_query(school).where("activities.activity_classification_id=?", evidence_id)
  end

  private def evidence_completed_in_year_count(school, school_year_start, school_year_end)
    evidence_finished(school).where("activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?", school_year_start, school_year_end).count
  end

end
