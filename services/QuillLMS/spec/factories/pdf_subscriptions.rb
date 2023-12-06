# == Schema Information
#
# Table name: pdf_subscriptions
#
#  id                :bigint           not null, primary key
#  filter_selections :jsonb
#  frequency         :string           not null
#  title             :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_pdf_subscriptions_on_frequency  (frequency)
#  index_pdf_subscriptions_on_title      (title)
#  index_pdf_subscriptions_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :pdf_subscription do
    frequency { PdfSubscription::FREQUENCIES.sample }
    title { PdfSubscription::TITLES.sample }
    user
  end
end
