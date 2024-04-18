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
require 'spec_helper'

RSpec.describe DiagnosticQuestionOptimalConcept, type: :model do
  it { should belong_to(:concept) }
  it { should belong_to(:question) }
end
