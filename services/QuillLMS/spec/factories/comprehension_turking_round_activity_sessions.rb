# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_turking_round_activity_sessions
#
#  id                   :integer          not null, primary key
#  activity_session_uid :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  turking_round_id     :integer
#
# Indexes
#
#  comprehension_turking_sessions_activity_uid  (activity_session_uid) UNIQUE
#  comprehension_turking_sessions_turking_id    (turking_round_id)
#
FactoryBot.define do
  factory :comprehension_turking_round_activity_session, class: 'Evidence::TurkingRoundActivitySession' do
    sequence(:turking_round_id) { |i| i }
    activity_session_uid { SecureRandom.uuid }
  end
end
