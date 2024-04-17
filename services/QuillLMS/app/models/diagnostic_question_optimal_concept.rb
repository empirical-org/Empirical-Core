# frozen_string_literal: true

# == Schema Information
#
# Table name: diagnostic_question_optimal_concepts
#
#  id           :bigint           not null, primary key
#  question_uid :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  concept_id   :integer          not null
#
# Indexes
#
#  unique_diagnostic_question_optimal_concepts_uid_id  (question_uid,concept_id) UNIQUE
#
class DiagnosticQuestionOptimalConcept < ApplicationRecord
  belongs_to :question, class_name: 'Question', foreign_key: :question_uid, primary_key: :uid
  belongs_to :concept
end
