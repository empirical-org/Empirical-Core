# frozen_string_literal: true

module AdminDiagnosticReports
  class EnqueueCsvEmailWorker
    include Sidekiq::Worker

    BASE_REPORT_NAME = 'diagnostic_growth_report'
    SKILL_REPORT_NAME = 'diagnostic_growth_report_skill'

    DEFAULT_TIMEFRAME = 'this-school-year'
    DEFAULT_AGGREGATION = 'grade'
    DEFAULT_DIAGNOSTIC_ID = 1663

    def perform(user_id)
      @user = User.find(user_id)

      SendCsvEmailWorker.perform_async(user_id, timeframe, school_ids, filters, aggregation, diagnostic_id)
    end

    private def base_filters
      @base_filters ||= extract_filter_selection(BASE_REPORT_NAME)
    end

    private def skill_filters
      @skill_filters ||= extract_filter_selection(SKILL_REPORT_NAME)
    end

    private def timeframe
      timeframe_start, timeframe_end = Snapshots::Timeframes.calculate_timeframes(base_filters&.fetch('timeframe', nil) || DEFAULT_TIMEFRAME)
        .map(&:to_s)
      {timeframe_start:, timeframe_end:}.stringify_keys
    end

    private def extract_filter_selection(report_name)
      AdminReportFilterSelection.find_by(user_id: @user.id, report: report_name)
        &.filter_selections
        &.transform_values do |value|
          next value.map{|selection| selection.fetch('value', nil)}.compact if value.is_a? Array

          value&.fetch('value', nil)
        end
    end

    private def aggregation = skill_filters&.fetch('group_by_value', nil) || DEFAULT_AGGREGATION
    private def diagnostic_id = skill_filters&.fetch('diagnostic_type_value', nil) || DEFAULT_DIAGNOSTIC_ID
    private def filters = base_filters&.slice('grades', 'teacher_ids', 'classroom_ids')
    private def school_ids = base_filters&.fetch('school_ids', nil) || @user.administered_premium_schools
  end
end