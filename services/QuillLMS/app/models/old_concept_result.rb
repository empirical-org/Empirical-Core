# frozen_string_literal: true

# == Schema Information
#
# Table name: old_concept_results
#
#  id                         :integer          not null, primary key
#  metadata                   :json
#  question_type              :string
#  activity_classification_id :integer
#  activity_session_id        :integer
#  concept_id                 :integer          not null
#
# Indexes
#
#  index_old_concept_results_on_activity_session_id  (activity_session_id)
#  index_old_concept_results_on_concept_id           (concept_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_classification_id => activity_classifications.id)
#
class OldConceptResult < ApplicationRecord
  belongs_to :concept
  belongs_to :activity_session
  belongs_to :activity_classification

  validates :concept, presence: true
  validates :activity_session_id, presence: true


  validates :question_type, inclusion: { in: %w(passage-proofreader sentence-writing sentence-fragment-expansion sentence-fragment-identification sentence-combining fill-in-the-blanks lessons-slide comprehension),
                   message: "%<value>s is not a valid question_type" }, :allow_nil => true

  def correct?
    metadata.key?('correct') && metadata['correct'] == 1
  end

  def concept_uid=(concept_uid)
    self.concept = Concept.where(uid: concept_uid).first
  end
end
