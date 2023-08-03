# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_healths
#
#  id                                  :bigint           not null, primary key
#  prompt_id                           :integer          not null
#  activity_short_name                 :string           not null
#  text                                :string           not null
#  current_version                     :integer          not null
#  version_responses                   :integer          not null
#  first_attempt_optimal               :integer
#  final_attempt_optimal               :integer
#  avg_attempts                        :float
#  confidence                          :float
#  percent_automl_consecutive_repeated :integer
#  percent_automl                      :integer
#  percent_plagiarism                  :integer
#  percent_opinion                     :integer
#  percent_grammar                     :integer
#  percent_spelling                    :integer
#  avg_time_spent_per_prompt           :integer
#  evidence_activity_health_id         :bigint
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#
FactoryBot.define do
  factory :evidence_prompt_health do
    prompt_id { 1 }
    activity_short_name { "test activity" }
    text { "some prompt text here" }
    current_version { 1 }
    version_responses { 10 }
    first_attempt_optimal { 90 }
    avg_attempts { 3 }
  end
end
