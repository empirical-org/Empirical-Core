# frozen_string_literal: true

# == Schema Information
#
# Table name: lockers
#
#  id          :bigint           not null, primary key
#  label       :string
#  preferences :jsonb
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#
FactoryBot.define do
  factory :locker do
    user_id { create(:user).id }
    label { 'Test locker label'}
    preferences { { 'test locker section': [] } }
  end
end
