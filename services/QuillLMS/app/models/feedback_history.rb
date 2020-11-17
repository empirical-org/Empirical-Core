class FeedbackHistory < ActiveRecord::Base
  CONCEPT_UID_LENGTH = 22
  DEFAULT_PROMPT_TYPE = "Comprehension::Prompt"
  MIN_ATTEMPT = 1
  MAX_ATTEMPT = 5
  MIN_ENTRY_LENGTH = 25
  MAX_ENTRY_LENGTH = 500
  MIN_FEEDBACK_LENGTH = 10
  MAX_FEEDBACK_LENGTH = 500
  FEEDBACK_TYPES = [
    GRAMMAR = "grammar",
    PLAGIARISM = "plagiarism",
    RULES_BASED = "rules-based",
    SEMANTIC = "semantic",
    SPELLING = "spelling"
  ]

  before_validation :confirm_prompt_type, on: :create

  belongs_to :activity_session, foreign_key: :activity_session_uid, primary_key: :uid
  belongs_to :prompt, polymorphic: true
  belongs_to :concept, foreign_key: :concept_uid, primary_key: :uid

  validates :activity_session_uid, presence: true
  validates :concept_uid, allow_blank: true, length: {is: CONCEPT_UID_LENGTH}
  validates :attempt, presence: true,
    numericality: {
      only_integer: true,
      less_than_or_equal_to: MAX_ATTEMPT,
      greater_than_or_equal_to: MIN_ATTEMPT
    }
  validates :entry, presence: true, length: {in: MIN_ENTRY_LENGTH..MAX_ENTRY_LENGTH}
  validates :feedback_text, length: {in: MIN_FEEDBACK_LENGTH..MAX_FEEDBACK_LENGTH}
  validates :feedback_type, presence: true, inclusion: {in: FEEDBACK_TYPES}
  validates :optimal, inclusion: { in: [true, false] }
  validates :time, presence: true
  validates :used, inclusion: { in: [true, false] }

  scope :used,  -> { where(used: true) }

  def concept_results_hash
    return {} if concept.blank?
    {
      concept_uid: concept_uid,
      activity_session_id: activity_session.id,
      activity_classification_id: ActivityClassification.comprehension.id,
      concept_id: concept.id,
      metadata: {
        correct: optimal ? 1: 0,
        answer: entry,
        feedback_type: feedback_type
      }
    }
  end

  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :activity_session_uid, :concept_uid, :attempt, :entry, :optimal, :used,
             :feedback_text, :feedback_type, :time, :metadata],
      include: [:prompt]
    ))
  end

  def self.batch_create(param_array)
    param_array.map { |params| create(params) }
  end

  private def confirm_prompt_type
    self.prompt_type = DEFAULT_PROMPT_TYPE if prompt_id && !prompt_type
  end
end
