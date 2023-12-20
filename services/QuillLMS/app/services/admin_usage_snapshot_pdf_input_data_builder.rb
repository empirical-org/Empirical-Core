# frozen_string_literal: true

class AdminUsageSnapshotPdfInputDataBuilder < ApplicationService
  attr_reader :admin_report_filter_selection

  delegate :filter_selections, to: :admin_report_filter_selection

  GRADE_OPTION_NAMES = SnapshotsController::GRADE_OPTIONS.pluck(:name).sort.freeze

  def initialize(admin_report_filter_selection)
    @admin_report_filter_selection = admin_report_filter_selection
  end

  def run
    {
      classrooms:,
      grades:,
      schools:,
      teachers:,
      timeframe:
    }
  end

  private def classrooms = filter_selections['classrooms']&.pluck('name')

  private def grades
    return nil if raw_grades.sort.eql?(GRADE_OPTION_NAMES)

    raw_grades
  end

  private def raw_grades = filter_selections['grades']&.pluck('name')
  private def schools = filter_selections['schools']&.pluck('name')
  private def teachers = filter_selections['teachers']&.pluck('name')
  private def timeframe = filter_selections['timeframe']['name']
end
