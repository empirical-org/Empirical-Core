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
class ConceptResultPreviousFeedback < ApplicationRecord
  has_many :concept_results

  validates :text, uniqueness: true, presence: true
end
