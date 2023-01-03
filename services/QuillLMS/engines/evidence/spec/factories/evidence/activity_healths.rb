# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_activity_health, class: 'Evidence::ActivityHealth' do
    name { "test name" }
    flag { "production" }
    activity_id { 1 }
    version { 1 }
    version_plays { 10 }
    total_plays { 10 }
    completion_rate { 91 }
    because_final_optimal { 66 }
    but_final_optimal { 77 }
    so_final_optimal { 88 }
    avg_completion_time { 303 }
  end
end
