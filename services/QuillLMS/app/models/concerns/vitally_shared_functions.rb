# frozen_string_literal: true

module VitallySharedFunctions
  extend ActiveSupport::Concern

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

  def in_school_year(activities, school_year_start, school_year_end)
    activities.select {|r| r.created_at >= school_year_start && r.created_at < school_year_end }
  end

  def evidence_assigned_in_year_count(entity, school_year_start, school_year_end)
    sum_students(filter_evidence(in_school_year(activities_assigned_query(entity), school_year_start, school_year_end)))
  end

  private def evidence_assigned_count(entity)
    sum_students(filter_evidence(activities_assigned_query(entity)))
  end

  private def evidence_finished(entity)
    activities_finished_query(entity).where('activities.activity_classification_id=?', ActivityClassification.evidence.id)
  end

  private def evidence_completed_in_year_count(entity, school_year_start, school_year_end)
    evidence_finished(entity).where('activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?', school_year_start, school_year_end).count
  end
end