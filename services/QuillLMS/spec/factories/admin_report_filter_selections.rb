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
FactoryBot.define do
  factory :admin_report_filter_selection do
    report { AdminReportFilterSelection::REPORTS.sample }
    filter_selections { '{}' }
    user

    factory :usage_snapshot_report_pdf_filter_selection do
      report { AdminReportFilterSelection::USAGE_SNAPSHOT_REPORT_PDF }
    end

    trait :with_default_filters do
      filter_selections do
        {
          custom_end_date: nil,
          custom_start_date: nil,
          grades: [
            { name: 'Kindergarten', label: 'Kindergarten', value: 'Kindergarten' },
            { name: '1st', label: '1st', value: '1' },
            { name: '2nd', label: '2nd', value: '2' },
            { name: '3rd', label: '3rd', value: '3' },
            { name: '4th', label: '4th', value: '4' },
            { name: '5th', label: '5th', value: '5' },
            { name: '6th', label: '6th', value: '6' },
            { name: '7th', label: '7th', value: '7' },
            { name: '8th', label: '8th', value: '8' },
            { name: '9th', label: '9th', value: '9' },
            { name: '10th', label: '10th', value: '10' },
            { name: '11th', label: '11th', value: '11' },
            { name: '12th', label: '12th', value: '12' },
            { name: 'University', label: 'University', value: 'University' },
            { name: 'Other', label: 'Other', value: 'Other' },
            { name: 'No grade set', label: 'No grade set', value: 'null' }
          ],
          timeframe: {
            name: 'This school year',
            label: 'This school year',
            value: 'this-school-year',
            default: true
          }
        }
      end


    end
  end
end
