# frozen_string_literal: true

FactoryBot.define do
  factory :change_log do
    changed_record { create(:concept) }
    action 'Renamed'
    explanation 'The first name was okay but this name is better.'
    user { create(:user) }
  end
end
