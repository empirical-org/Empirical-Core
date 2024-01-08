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
  REPORTS = [
    DATA_EXPORT = 'data_export',
    DIAGNOSTIC_GROWTH_REPORT = 'diagnostic_growth_report',
    USAGE_SNAPSHOT_REPORT = 'usage_snapshot_report',
    USAGE_SNAPSHOT_REPORT_PDF = 'usage_snapshot_report_pdf'
  ]

  belongs_to :user

  validates :filter_selections, presence: true
  validates :report, inclusion: { in: REPORTS }
  validates :user_id, presence: true

  def classroom_ids = filter_selections['classrooms']&.pluck('value') || all_classrooms.pluck(:id)
  def custom_end = filter_selections['custom_end_date'].to_s
  def custom_start = filter_selections['custom_start_date'].to_s
  def grades = filter_selections['grades']&.pluck('value')
  def teacher_ids = filter_selections['teachers']&.pluck('value') || all_teachers.pluck(:id)
  def school_ids = filter_selections['schools']&.pluck('value') || all_schools.pluck(:id)
  def timeframe = Snapshots::Timeframes.find_timeframe(timeframe_value)
  def timeframe_value = filter_selections.dig('timeframe', 'value')

  private def all_classrooms
    Classroom
      .unscoped
      .distinct
      .joins(:classrooms_teachers)
      .where(classrooms_teachers: { user: all_teachers })
  end

  private def all_schools
    School
      .joins(:schools_admins)
      .where(schools_admins: { user: user })
  end

  private def all_teachers
    User
      .teachers_in_schools(all_schools.pluck(:id))
      .where(classrooms_teachers: { role: [nil, ClassroomsTeacher::ROLE_TYPES[:owner]] })
  end
end
