class ConceptResult < ActiveRecord::Base

  belongs_to :concept
  belongs_to :activity_session

  validates :concept, presence: true
  validates :activity_session, presence: true

  # Calculate the average words per minute for all the Typing Speed results
  # def self.average_wpm
  #   joins(:concept_tag)
  #   .where(concept_tags: {name: "Typing Speed"})
  #   .average("cast(metadata->>'wpm' as int)")
  # end

  def concept_uid=(concept_uid)
    self.concept = Concept.where(uid: concept_uid).first
  end
end