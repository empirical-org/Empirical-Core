class ConceptResult < ActiveRecord::Base

  belongs_to :concept
  belongs_to :activity_session
  belongs_to :activity_classification

  validates :concept, presence: true
  validates :activity_session_id, presence: true


  validates :question_type, inclusion: { in: %w(passage-proofreader sentence-writing sentence-fragment-expansion sentence-fragment-identification sentence-combining fill-in-the-blanks),
                   message: "%{value} is not a valid question_type" }, :allow_nil => true

  # Calculate the average words per minute for all the Typing Speed results
  # def self.average_wpm
  #   joins(:concept)
  #   .where(concepts: {name: "Typing Speed"})
  #   .average("cast(metadata->>'wpm' as int)")
  # end

  def correct?
    metadata.has_key?('correct') && metadata['correct'] == 1
  end

  def concept_uid=(concept_uid)
    self.concept = Concept.where(uid: concept_uid).first
  end

  def self.from_activity_session_with_names(activity_session)
    ConceptResult.where(activity_session_id: activity_session.id)
                 .joins(:concept)
                 .select('concept_results.*, concepts.name')
  end


end
