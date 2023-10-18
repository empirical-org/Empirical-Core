# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_report_filter_selections
#
#  id                :bigint           not null, primary key
#  filter_selections :jsonb
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
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class AdminReportFilterSelection < ApplicationRecord
  belongs_to :user

  validates :user_id, presence: true

  REPORTS = [
    DATA_EXPORT = 'data_export',
    USAGE_SNAPSHOT_REPORT = 'usage_snapshot_report',
    GROWTH_DIAGNOSTIC_REPORT = 'growth_diagnostic_report',
  ]

  validates :report, :inclusion=> { :in => REPORTS }
end
