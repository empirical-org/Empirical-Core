# frozen_string_literal: true

module AdminDiagnosticReports
  class EnqueueCsvEmailWorker
    include Sidekiq::Worker

    BASE_REPORT_NAME = 'diagnostic_growth_report'
    OVERVIEW_REPORT_NAME = 'diagnostic_growth_report_overview'
    SKILL_REPORT_NAME = 'diagnostic_growth_report_skill'
    STUDENT_REPORT_NAME = 'diagnostic_growth_report_student'

    DEFAULT_TIMEFRAME = 'this-school-year'
    DEFAULT_AGGREGATION = 'grade'
    DEFAULT_DIAGNOSTIC_ID = 1663

    def perform(user_id)
      @user = User.find(user_id)

      SendCsvEmailWorker.perform_async(user_id, timeframe, school_ids, shared_filters, overview_filters, skills_filters, students_filters)
    end

    private def stored_base_filters = @stored_base_filters ||= AdminReportFilterSelection.find_by(user_id: @user.id, report: BASE_REPORT_NAME)
    private def stored_overview_filters = @stored_overview_filters ||= AdminReportFilterSelection.find_by(user_id: @user.id, report: OVERVIEW_REPORT_NAME)
    private def stored_skills_filters = @stored_skills_filters ||= AdminReportFilterSelection.find_by(user_id: @user.id, report: SKILL_REPORT_NAME)
    private def stored_students_filters = @stored_students_filters ||= AdminReportFilterSelection.find_by(user_id: @user.id, report: STUDENT_REPORT_NAME)

    private def shared_filters
      {
        grades:,
        teacher_ids:,
        classroom_ids:
      }
    end

    private def overview_filters
      {
        aggregation: overview_aggregation
      }
    end

    private def skills_filters
      {
        aggregation: skills_aggregation,
        diagnostic_id: skills_diagnostic_id
      }
    end

    private def students_filters
      {
        diagnostic_id: students_diagnostic_id
      }
    end

    private def timeframe
      timeframe_start, timeframe_end = Snapshots::Timeframes.calculate_timeframes(stored_base_filters&.timeframe_name || DEFAULT_TIMEFRAME)
        .map(&:to_s)
      {timeframe_start:, timeframe_end:}
    end

    private def overview_aggregation = stored_overview_filters&.aggregation || DEFAULT_AGGREGATION

    private def skills_aggregation = stored_skills_filters&.aggregation || DEFAULT_AGGREGATION
    private def skills_diagnostic_id = stored_skills_filters&.diagnostic_id || DEFAULT_DIAGNOSTIC_ID

    private def students_diagnostic_id = stored_students_filters&.diagnostic_id || DEFAULT_DIAGNOSTIC_ID

    private def classroom_ids = stored_base_filters&.classroom_ids
    private def grades = stored_base_filters&.grade_values
    private def school_ids = stored_base_filters&.school_ids || @user.administered_premium_schools.pluck(:id)
    private def teacher_ids = stored_base_filters&.teacher_ids
  end
end
