# frozen_string_literal: true

module VitallySharedFunctions
  extend ActiveSupport::Concern

  POST_DIAGNOSTIC_IDS = Activity.where(id: Activity::PRE_TEST_DIAGNOSTIC_IDS).pluck(:follow_up_activity_id)

  def activities_per_student(active_students, activities_finished)
    return 0 unless active_students.nonzero?

    (activities_finished.to_f / active_students).round(2)
  end

  def sum_students(activities)
    activities.map { |r| r&.assigned_student_ids&.count || 0 }.sum
  end

  def filter_evidence(activities)
    evidence_ids = Activity.where(activity_classification_id: ActivityClassification.evidence.id).pluck(:id)
    activities.select {|r| evidence_ids.include?(r.id) }
  end

  def filter_diagnostics(activities)
    diagnostic_ids = Activity.where(activity_classification_id: ActivityClassification.diagnostic.id).pluck(:id)
    activities.select {|r| diagnostic_ids.include?(r.id) }
  end

  def filter_pre_diagnostic(activities)
    activities.select {|r| Activity::PRE_TEST_DIAGNOSTIC_IDS.include?(r.id) }
  end

  def filter_post_diagnostic(activities)
    activities.select {|r| POST_DIAGNOSTIC_IDS.include?(r.id) }
  end

  def in_school_year(activities, school_year_start, school_year_end)
    activities.select {|r| r.created_at >= school_year_start && r.created_at < school_year_end }
  end

  def evidence_assigned_this_year_count
    sum_students(filter_evidence(in_school_year(activities_assigned_query(entity), school_year_start, school_year_end)))
  end

  def evidence_assigned_last_year_count
    sum_students(filter_evidence(in_school_year(activities_assigned_query(entity), last_school_year_start, school_year_start)))
  end

  def pre_diagnostics_assigned_in_year_count
    sum_students(filter_pre_diagnostic(in_school_year(activities_assigned_query(entity), school_year_start, school_year_end)))
  end

  def post_diagnostics_assigned_in_year_count
    sum_students(filter_post_diagnostic(in_school_year(activities_assigned_query(entity), school_year_start, school_year_end)))
  end

  def pre_diagnostics_completed_in_year_count
    pre_diagnostics_completed(entity).where("activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?", school_year_start, school_year_end).count
  end

  def post_diagnostics_completed_in_year_count
    post_diagnostics_completed(entity).where("activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?", school_year_start, school_year_end).count
  end

  def pre_diagnostics_assigned_count
    sum_students(filter_pre_diagnostic((activities_assigned_query(entity))))
  end

  def post_diagnostics_assigned_count
    sum_students(filter_post_diagnostic((activities_assigned_query(entity))))
  end

  def diagnostics_completed(entity)
    activities_finished_query(entity).where(classification: {key: ActivityClassification::DIAGNOSTIC_KEY})
  end

  private def pre_diagnostics_completed(entity)
    activities_finished_query(entity).where(activity: {id: Activity::PRE_TEST_DIAGNOSTIC_IDS})
  end

  private def post_diagnostics_completed(entity)
    activities_finished_query(entity).where(activity: {id: POST_DIAGNOSTIC_IDS})
  end

  private def evidence_assigned_count(entity)
    sum_students(filter_evidence(activities_assigned_query(entity)))
  end

  private def evidence_finished(entity)
    activities_finished_query(entity).where(classification: {key: ActivityClassification::EVIDENCE_KEY})
  end

  private def evidence_completed_this_year_count
    evidence_finished(entity).where("activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?", school_year_start, school_year_end).count
  end

  private def evidence_completed_last_year_count
    evidence_finished(entity).where("activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?", last_school_year_start, school_year_start).count
  end
end