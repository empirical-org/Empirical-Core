# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_turking_round_activity_sessions
#
#  id                   :integer          not null, primary key
#  turking_round_id     :integer
#  activity_session_uid :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
FactoryBot.define do
  factory :evidence_turking_round_activity_session, class: 'Evidence::TurkingRoundActivitySession' do
    association :turking_round, factory: :evidence_turking_round
    activity_session_uid { SecureRandom.uuid }
  end
end
