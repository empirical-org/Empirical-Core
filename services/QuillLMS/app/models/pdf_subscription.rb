# frozen_string_literal: true

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
class PdfSubscription < ApplicationRecord
  FREQUENCIES = [
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
  ]

  TITLES = [
    ADMIN_USAGE_SNAPSHOT_REPORT = 'admin_usage_snapshot_report'
  ]

  belongs_to :user

  validates :frequency, presence: true, inclusion: { in: FREQUENCIES }
  validates :title, presence: true, inclusion: { in: TITLES }
  validates :user_id, presence: true
end
