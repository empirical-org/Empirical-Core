# frozen_string_literal: true

module AdminDiagnosticReports
  class ConstructQueryPayload < ApplicationService
    attr_reader :user_id, :shared_filters_name, :specific_filters_name

    DEFAULT_TIMEFRAME = 'this-school-year'
    DEFAULT_AGGREGATION = 'grade'
    DEFAULT_DIAGNOSTIC_ID = 1663

    def initialize(user_id, shared_filters_name, specific_filters_name)
      @user_id = user_id
      @shared_filters_name = shared_filters_name
      @specific_filters_name = specific_filters_name
    end

    def run = payload

    private def report_specific_filters
      raise NotImplementedError
    end

    private def default_timeframe = DEFAULT_TIMEFRAME
    private def default_aggregation = DEFAULT_AGGREGATION
    private def default_diagnostic_id = DEFAULT_DIAGNOSTIC_ID

    private def shared_filters = @shared_filters ||= AdminReportFilterSelection.find_by(user_id:, report: shared_filters_name)
    private def specific_filters = @specific_filters ||= AdminReportFilterSelection.find_by(user_id:, report: specific_filters_name)
    private def user = @user ||= User.find(user_id)

    private def classroom_ids = shared_filters&.classroom_ids
    private def grades = shared_filters&.grade_values
    private def school_ids = shared_filters&.school_ids.presence || user.administered_premium_schools.pluck(:id)
    private def teacher_ids = shared_filters&.teacher_ids
    private def timeframe_name = shared_filters&.timeframe_value

    private def payload
      timeframe.merge(filters).merge(report_specific_filters).merge({
        school_ids:,
        user:
      })
    end

    private def timeframe
      timeframe_start, timeframe_end = Snapshots::Timeframes.calculate_timeframes(timeframe_name || default_timeframe)
      { timeframe_start:, timeframe_end: }
    end

    private def filters
      {
        grades:,
        teacher_ids:,
        classroom_ids:
      }
    end
  end
end
