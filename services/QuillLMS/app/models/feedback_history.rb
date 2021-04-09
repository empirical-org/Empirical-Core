# == Schema Information
#
# Table name: feedback_histories
#
#  id            :integer          not null, primary key
#  attempt       :integer          not null
#  concept_uid   :text
#  entry         :text             not null
#  feedback_text :text
#  feedback_type :text             not null
#  metadata      :jsonb
#  optimal       :boolean          not null
#  prompt_type   :string
#  rule_uid      :string
#  session_uid   :text
#  time          :datetime         not null
#  used          :boolean          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  prompt_id     :integer
#
# Indexes
#
#  index_feedback_histories_on_concept_uid         (concept_uid)
#  index_feedback_histories_on_prompt_type_and_id  (prompt_type,prompt_id)
#  index_feedback_histories_on_rule_uid            (rule_uid)
#  index_feedback_histories_on_session_uid         (session_uid)
#
class FeedbackHistory < ActiveRecord::Base
  CONCEPT_UID_LENGTH = 22
  DEFAULT_PROMPT_TYPE = "Comprehension::Prompt"
  MIN_ATTEMPT = 1
  MAX_ATTEMPT = 5
  MIN_ENTRY_LENGTH = 5
  MAX_ENTRY_LENGTH = 500
  MIN_FEEDBACK_LENGTH = 10
  MAX_FEEDBACK_LENGTH = 500
  FEEDBACK_TYPES = [
    GRAMMAR = "grammar",
    PLAGIARISM = "plagiarism",
    RULES_BASED_ONE = "rules-based-1",
    RULES_BASED_TWO = "rules-based-2",
    RULES_BASED_THREE = "rules-based-3",
    SEMANTIC = "semantic",
    SPELLING = "spelling",
    OPINION = "opinion"
  ]

  before_create :anonymize_session_uid
  before_validation :confirm_prompt_type, on: :create

  belongs_to :feedback_session, foreign_key: :session_uid, primary_key: :uid
  has_one :activity_session, through: :feedback_session
  belongs_to :prompt, polymorphic: true
  belongs_to :concept, foreign_key: :concept_uid, primary_key: :uid

  validates :session_uid, presence: true
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
      activity_session_id: activity_session&.id,
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
      only: [:id, :session_uid, :concept_uid, :attempt, :entry, :optimal, :used,
             :feedback_text, :feedback_type, :time, :metadata, :rule_uid],
      include: [:prompt]
    ))
  end

  def self.batch_create(param_array)
    param_array.map { |params| create(params) }
  end

  private def confirm_prompt_type
    self.prompt_type = DEFAULT_PROMPT_TYPE if prompt_id && !prompt_type
  end

  private def anonymize_session_uid
    self.session_uid = FeedbackSession.get_uid_for_activity_session(session_uid)
  end
end
