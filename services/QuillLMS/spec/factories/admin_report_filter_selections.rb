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
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :admin_report_filter_selection do
    report { AdminReportFilterSelection::REPORTS.sample }
    filter_selections { '{}' }
    user

    factory :usage_snapshot_report_pdf_filter_selection do
      report { AdminReportFilterSelection::USAGE_SNAPSHOT_REPORT_PDF }
    end
  end
end
