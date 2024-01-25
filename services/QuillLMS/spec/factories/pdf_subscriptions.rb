# == Schema Information
#
# Table name: pdf_subscriptions
#
#  id                               :bigint           not null, primary key
#  frequency                        :string           not null
#  token                            :string           not null
#  created_at                       :datetime         not null
#  updated_at                       :datetime         not null
#  admin_report_filter_selection_id :bigint           not null
#
# Indexes
#
#  index_pdf_subscriptions_on_admin_report_filter_selection_id  (admin_report_filter_selection_id)
#  index_pdf_subscriptions_on_frequency                         (frequency)
#
FactoryBot.define do
  factory :pdf_subscription do
    frequency { PdfSubscription::MONTHLY }
    association :admin_report_filter_selection, factory: :usage_snapshot_report_pdf_filter_selection

    trait(:weekly) { frequency { PdfSubscription::WEEKLY } }
    trait(:monthly) { frequency { PdfSubscription::MONTHLY }}
  end
end
