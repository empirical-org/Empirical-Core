# frozen_string_literal: true

module VitallyIntegration
  class PreviousYearSchoolDatum
    include VitallySchoolStats
    include VitallySharedFunctions

    attr_accessor :school_year_start, :school_year_end, :school, :entity

    def initialize(school, year)
      @school_year_start = Date.new(year, 7, 1)
      @school_year_end = school_year_start + 1.year
      @school = school
      @entity = school
    end

    def calculate_data
      raise "Cannot calculate data for a school year that is still ongoing." if school_year_end > Time.current

      active_students_this_year = active_students_query(school).where("activity_sessions.completed_at >= ? and activity_sessions.completed_at < ?", school_year_start, school_year_end).count
      activities_finished_this_year = activities_finished_query(school).where("activity_sessions.completed_at >= ? and activity_sessions.completed_at < ?", school_year_start, school_year_end).count
      evidence_activities_completed_this_year = evidence_completed_in_year_count
      {
        # this will not be accurate if calculated after the last day of the school year
        total_students: school.students.where(last_sign_in: school_year_start..school_year_end).count,
        active_students: active_students_this_year,
        activities_finished: activities_finished_this_year,
        activities_per_student: activities_per_student(active_students_this_year, activities_finished_this_year),
        **diagnostic_rollups,
        evidence_activities_assigned: evidence_assigned_in_year_count,
        evidence_activities_completed: evidence_activities_completed_this_year,
        completed_evidence_activities_per_student: activities_per_student(active_students_this_year, evidence_activities_completed_this_year)
      }
    end

    def diagnostic_rollups
      {
        pre_diagnostics_assigned: pre_diagnostics_assigned_in_year_count,
        pre_diagnostics_completed: pre_diagnostics_completed_in_year_count,
        post_diagnostics_assigned: post_diagnostics_assigned_in_year_count,
        post_diagnostics_completed: post_diagnostics_completed_in_year_count
      }
    end
  end
end
