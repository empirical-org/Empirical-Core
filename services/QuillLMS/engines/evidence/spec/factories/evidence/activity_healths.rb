# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_activity_healths
#
#  id                    :bigint           not null, primary key
#  name                  :string           not null
#  flag                  :string           not null
#  activity_id           :integer          not null
#  version               :integer          not null
#  version_plays         :integer          not null
#  total_plays           :integer          not null
#  completion_rate       :integer
#  because_final_optimal :integer
#  but_final_optimal     :integer
#  so_final_optimal      :integer
#  avg_completion_time   :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#
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
