# frozen_string_literal: true

# == Schema Information
#
# Table name: active_activity_sessions
#
#  id         :integer          not null, primary key
#  data       :jsonb
#  uid        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_active_activity_sessions_on_uid  (uid) UNIQUE
#
FactoryBot.define do
  factory :active_activity_session do
    uid { SecureRandom.uuid }
    data { { foo: 'bar'} }
  end
end
