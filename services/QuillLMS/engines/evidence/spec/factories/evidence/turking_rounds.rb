# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_turking_rounds
#
#  id          :integer          not null, primary key
#  activity_id :integer
#  uuid        :uuid
#  expires_at  :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
FactoryBot.define do
  factory :evidence_turking_round, class: 'Evidence::TurkingRound' do
    association :activity, factory: :evidence_activity
    expires_at { 1.month.from_now }
    uuid { SecureRandom.uuid }
  end
end
