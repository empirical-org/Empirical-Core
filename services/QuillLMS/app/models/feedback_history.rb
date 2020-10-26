class FeedbackHistory < ActiveRecord::Base
  CONCEPT_UID_LENGTH = 22
  MIN_ATTEMPT = 1
  MAX_ATTEMPT = 5
  MIN_ENTRY_LENGTH = 25
  MAX_ENTRY_LENGTH = 500
  MIN_FEEDBACK_LENGTH = 25
  MAX_FEEDBACK_LENGTH = 500
  FEEDBACK_TYPES = [
    GRAMMAR = "grammar",
    PLAGIARISM = "plagiarism",
    RULES_BASED = "rules-based",
    SEMANTIC = "semantic",
    SPELLING = "spelling"
  ]

  belongs_to :activity_session, foreign_key: :activity_session_uid, primary_key: :uid
  belongs_to :prompt, polymorphic: true
  belongs_to :concept, foreign_key: :concept_uid, primary_key: :uid

  validates :concept_uid, length: {is: CONCEPT_UID_LENGTH}
  validates :attempt, presence: true,
    numericality: {
      only_integer: true,
      less_than_or_equal_to: MAX_ATTEMPT,
      greater_than_or_equal_to: MIN_ATTEMPT
    }
  validates :entry, presence: true, length: {in: MIN_ENTRY_LENGTH..MAX_ENTRY_LENGTH}
  validates :feedback_text, length: {in: MIN_FEEDBACK_LENGTH..MAX_FEEDBACK_LENGTH}
  validates :feedback_type, presence: true, inclusion: {in: FEEDBACK_TYPES}
  validates :optimal, presence: true, inclusion: { in: [true, false] }
  validates :time, presence: true
  validates :used, presence: true, inclusion: { in: [true, false] }
  
  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :activity_session_uid, :concept_uid, :attempt, :entry, :optimal, :used,
             :feedback_text, :feedback_type, :time, :metadata],
      include: [:prompt]
    ))
  end
end
