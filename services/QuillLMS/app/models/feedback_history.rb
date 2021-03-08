# == Schema Information
#
# Table name: feedback_histories
#
#  id                   :integer          not null, primary key
#  activity_session_uid :text
#  attempt              :integer          not null
#  concept_uid          :text
#  entry                :text             not null
#  feedback_text        :text
#  feedback_type        :text             not null
#  metadata             :jsonb
#  optimal              :boolean          not null
#  prompt_type          :string
#  rule_uid             :string
#  time                 :datetime         not null
#  used                 :boolean          not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  prompt_id            :integer
#
# Indexes
#
#  index_feedback_histories_on_activity_session_uid  (activity_session_uid)
#  index_feedback_histories_on_concept_uid           (concept_uid)
#  index_feedback_histories_on_prompt_type_and_id    (prompt_type,prompt_id)
#  index_feedback_histories_on_rule_uid              (rule_uid)
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
             :feedback_text, :feedback_type, :time, :metadata, :rule_uid],
      include: [:prompt]
    ))
  end

  def self.serialize_detail_by_activity_session(activity_session_uid)
    histories = where(activity_session_uid: activity_session_uid).all


    start_date = histories.first&.time
    activity_id = histories.first&.prompt&.activity_id
    because_attempts = serialize_conjunction_feedback_history(histories.filter { |h| h.prompt&.conjunction == 'because' })
    but_attempts = serialize_conjunction_feedback_history(histories.filter { |h| h.prompt&.conjunction == 'but' })
    so_attempts = serialize_conjunction_feedback_history(histories.filter { |h| h.prompt&.conjunction == 'so' })

    output = {
      start_date: start_date,
      session_uid: activity_session_uid,
      activity_id: activity_id,
      session_completed: "",
      prompts: [
      ]
    }

    output.prompts.push(because_attempts) if because_attempts[:prompt_id]
    output.prompts.push(but_attempts) if but_attempts[:prompt_id]
    output.prompts.push(so_attempts) if so_attempts[:prompt_id]

    output
  end

  def self.serialize_conjunction_feedback_history(feedback_histories)
    conjunction_prompt = {
      prompt_id: feedback_histories.first&.prompt_id,
      conjunction: feedback_histories.first&.prompt&.conjunction,
      attempts: {}
    }

    feedback_histories.each do |feedback_history|
      conjunction_prompt[:attempts][feedback_history.attempt] ||= []
      conjunction_prompt[:attempts][feedback_history.attempt].push({
        used: feedback_history.used,
        entry: feedback_history.entry,
        feedback_text: feedback_history.feedback_text,
        feedback_type: feedback_history.feedback_type,
        optimal: feedback_history.optimal
      })
    end

    conjunction_prompt
  end

  def self.batch_create(param_array)
    param_array.map { |params| create(params) }
  end

  private def confirm_prompt_type
    self.prompt_type = DEFAULT_PROMPT_TYPE if prompt_id && !prompt_type
  end
end
