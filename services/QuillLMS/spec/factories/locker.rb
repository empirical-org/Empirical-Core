# frozen_string_literal: true

require 'rails_helper'

FactoryBot.define do
  factory :locker do
    user_id { create(:user).id }
    label { 'Test locker label'}
    preferences { { 'test locker section': [] } }
  end
end
