# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_report_filter_selections
#
#  id                :bigint           not null, primary key
#  filter_selections :jsonb            not null
#  report            :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_admin_report_filter_selections_on_report   (report)
#  index_admin_report_filter_selections_on_user_id  (user_id)
#
class AdminReportFilterSelection < ApplicationRecord
  GRADE_OPTION_NAMES = SnapshotsController::GRADE_OPTIONS.pluck(:name).sort.freeze

  REPORTS = [
    DATA_EXPORT = 'data_export',
    DIAGNOSTIC_GROWTH_REPORT = 'diagnostic_growth_report',
    USAGE_SNAPSHOT_REPORT = 'usage_snapshot_report',
    USAGE_SNAPSHOT_REPORT_PDF = 'usage_snapshot_report_pdf'
  ]

  SEGMENT_MAPPING = {
    USAGE_SNAPSHOT_REPORT_PDF => 'Usage Snapshot'
  }

  belongs_to :user

  has_many :pdf_subscriptions, dependent: :destroy

  validates :filter_selections, presence: true
  validates :report, inclusion: { in: REPORTS }
  validates :user_id, presence: true

  def self.segment_admin_report_subscriptions
    joins(:pdf_subscriptions)
      .pluck(:report)
      .uniq
      .map { |report| SEGMENT_MAPPING[report] }
      .compact
  end

  def classrooms = filter_selections['classrooms']&.pluck('name')
  def classroom_ids = filter_selections['classrooms']&.pluck('value')
  def custom_end = filter_selections['custom_end_date'].to_s
  def custom_start = filter_selections['custom_start_date'].to_s
  def grades = all_grades_selected? ? nil : selected_grades
  def grade_values = all_grades_selected? ? nil : selected_grade_values
  def teachers = filter_selections['teachers']&.pluck('name')
  def teacher_ids = filter_selections['teachers']&.pluck('value')
  def schools = filter_selections['schools']&.pluck('name')
  def school_ids = filter_selections['schools']&.pluck('value') || all_schools.pluck(:id)
  def timeframe = Snapshots::Timeframes.find_timeframe(timeframe_value)
  def timeframe_name = filter_selections.dig('timeframe', 'name')
  def timeframe_value = filter_selections.dig('timeframe', 'value')

  private def all_grades_selected? = selected_grades&.sort == GRADE_OPTION_NAMES
  private def all_schools = School.joins(:schools_admins).where(schools_admins: { user: user })
  private def selected_grades = filter_selections['grades']&.pluck('name')
  private def selected_grade_values = filter_selections['grades']&.pluck('value')
end
