# == Schema Information
#
# Table name: pdf_subscriptions
#
#  id                               :bigint           not null, primary key
#  frequency                        :string           not null
#  created_at                       :datetime         not null
#  updated_at                       :datetime         not null
#  admin_report_filter_selection_id :bigint           not null
#  user_id                          :bigint           not null
#
# Indexes
#
#  index_pdf_subscriptions_on_admin_report_filter_selection_id  (admin_report_filter_selection_id)
#  index_pdf_subscriptions_on_frequency                         (frequency)
#  index_pdf_subscriptions_on_user_id                           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (admin_report_filter_selection_id => admin_report_filter_selections.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :pdf_subscription do
    frequency { PdfSubscription::FREQUENCIES.sample }
    association :admin_report_filter_selection, factory: :usage_snapshot_report_pdf_filter_selection
  end
end
