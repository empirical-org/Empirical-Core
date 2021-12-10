# frozen_string_literal: true

FactoryBot.define do
  factory :user_activity_classification, class: 'UserActivityClassification' do
    user                       { create(:user) }
    activity_classification    { create(:activity_classification) }
    count                      { 0 }
  end
end

