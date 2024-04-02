# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_result_previous_feedbacks
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_concept_result_previous_feedbacks_on_text  (text) UNIQUE
#
FactoryBot.define do
  factory :concept_result_previous_feedback do
    sequence(:text) { |n| "This a student response answer #{n}." }
  end
end
