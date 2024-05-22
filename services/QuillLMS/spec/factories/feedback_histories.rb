# frozen_string_literal: true

# == Schema Information
#
# Table name: feedback_histories
#
#  id                   :integer          not null, primary key
#  activity_version     :integer          default(1), not null
#  attempt              :integer          not null
#  concept_uid          :text
#  entry                :text             not null
#  feedback_session_uid :text
#  feedback_text        :text
#  feedback_type        :text             not null
#  metadata             :jsonb
#  optimal              :boolean          not null
#  prompt_type          :string
#  rule_uid             :string
#  time                 :datetime         not null
#  used                 :boolean          not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  prompt_id            :integer
#
# Indexes
#
#  index_feedback_histories_on_concept_uid           (concept_uid)
#  index_feedback_histories_on_feedback_session_uid  (feedback_session_uid)
#  index_feedback_histories_on_prompt_type_and_id    (prompt_type,prompt_id)
#  index_feedback_histories_on_rule_uid              (rule_uid)
#
FactoryBot.define do
  factory :feedback_history do
    feedback_session_uid { SecureRandom.uuid }
    concept_uid { SecureRandom.uuid.slice(0, 22) }
    attempt { 1 }
    entry { "This is what the student submitted." }
    feedback_text { "This is the feedback the student got." }
    feedback_type { "autoML" }
    optimal { true }
    used { true }
    time { DateTime.current }
    metadata { {foo: 'bar'} }
    rule_uid { SecureRandom.uuid }
  end
end
