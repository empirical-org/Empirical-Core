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

      SendCsvEmailWorker.new.perform(user_id, timeframe, school_ids, shared_filters, overview_filters, skills_filters, students_filters)
      #SendCsvEmailWorker.perform_async(user_id, timeframe, school_ids, shared_filters, overview_filters, skills_filters, students_filters)
    end

    private def base_filters = @base_filters ||= extract_filter_selection(BASE_REPORT_NAME)

    private def overview_filters
      @overview_filters ||= {
        aggregation: extract_filter_selection(OVERVIEW_REPORT_NAME)&.fetch('group_by_value', nil) || DEFAULT_AGGREGATION
      }
    end

    private def skills_filters
      filter = extract_filter_selection(SKILL_REPORT_NAME)
      @skills_filters ||= {
        aggregation: filter&.fetch('group_by_value', nil) || DEFAULT_AGGREGATION,
        diagnostic_id: filter&.fetch('diagnostic_type_value', nil) || DEFAULT_DIAGNOSTIC_ID
      }
    end

    private def students_filters
      @students_filters ||= {
        aggregation: extract_filter_selection(STUDENT_REPORT_NAME)&.fetch('group_by_value', nil) || DEFAULT_AGGREGATION
      }
    end

    private def extract_filter_selection(report_name)
      AdminReportFilterSelection.find_by(user_id: @user.id, report: report_name)
        &.filter_selections
        &.transform_values do |value|
          next value.map{|selection| selection.fetch('value', nil)}.compact if value.is_a? Array

          value&.fetch('value', nil)
        end
    end

    private def timeframe
      timeframe_start, timeframe_end = Snapshots::Timeframes.calculate_timeframes(base_filters&.fetch('timeframe', nil) || DEFAULT_TIMEFRAME)
        .map(&:to_s)
      {timeframe_start:, timeframe_end:}.stringify_keys
    end

    private def school_ids = base_filters&.fetch('school_ids', nil) || @user.administered_premium_schools.pluck(:id)
    private def shared_filters = base_filters&.slice('grades', 'teacher_ids', 'classroom_ids')
  end
end
