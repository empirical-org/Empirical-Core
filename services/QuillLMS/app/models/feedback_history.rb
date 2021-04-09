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
  DEFAULT_PAGE_SIZE = 25
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

  def serialize_by_activity_session
   serializable_hash(only: [:session_uid, :start_date, :activity_id, :because_attempts, :but_attempts, :so_attempts, :complete], include: []).symbolize_keys
  end

  def serialize_by_activity_session_detail
   serializable_hash(only: [:entry, :feedback_text, :feedback_type, :optimal, :used], include: []).symbolize_keys
  end

  def self.batch_create(param_array)
    param_array.map { |params| create(params) }
  end

  private def confirm_prompt_type
    self.prompt_type = DEFAULT_PROMPT_TYPE if prompt_id && !prompt_type
  end

  def self.list_by_activity_session(activity_id: nil, page: 1, page_size: DEFAULT_PAGE_SIZE)
    query = select(<<-SQL
        feedback_histories.activity_session_uid AS session_uid,
        MIN(feedback_histories.time) AS start_date,
        comprehension_prompts.activity_id,
        COUNT(CASE WHEN comprehension_prompts.conjunction = 'because' THEN 1 END) AS because_attempts,
        COUNT(CASE WHEN comprehension_prompts.conjunction = 'but' THEN 1 END) AS but_attempts,
        COUNT(CASE WHEN comprehension_prompts.conjunction = 'so' THEN 1 END) AS so_attempts,
        (
          ((COUNT(CASE WHEN comprehension_prompts.conjunction = 'because' AND feedback_histories.optimal THEN 1 END) = 1) OR
            (COUNT(CASE WHEN comprehension_prompts.conjunction = 'because' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = 'because' THEN comprehension_prompts.max_attempts END))) AND
          ((COUNT(CASE WHEN comprehension_prompts.conjunction = 'but' AND feedback_histories.optimal THEN 1 END) = 1) OR
            (COUNT(CASE WHEN comprehension_prompts.conjunction = 'but' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = 'but' THEN comprehension_prompts.max_attempts END))) AND
          ((COUNT(CASE WHEN comprehension_prompts.conjunction = 'so' AND feedback_histories.optimal THEN 1 END) = 1) OR
            (COUNT(CASE WHEN comprehension_prompts.conjunction = 'so' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = 'so' THEN comprehension_prompts.max_attempts END)))
        ) AS complete
      SQL
      )
      .joins("LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id")
      .where(used: true)
      .group(:activity_session_uid, :activity_id)
      .order('start_date DESC')
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = query.limit(page_size)
    query = query.offset((page.to_i - 1) * page_size.to_i) if page && page.to_i > 1
    query
  end

  def self.serialize_detail_by_activity_session(activity_session_uid)
    history = FeedbackHistory.list_by_activity_session.where(activity_session_uid: activity_session_uid).first
    return nil unless history
    histories = FeedbackHistory.where(activity_session_uid: activity_session_uid).all

    output = history.serialize_by_activity_session
    prompt_groups = histories.group_by do |history|
      history&.prompt&.conjunction
    end.map do |conjunction, attempts|
      [conjunction, {prompt_id: attempts.first.prompt_id, attempts: attempts}]
    end.to_h.symbolize_keys

    attempt_groups = prompt_groups.map do |conjunction, detail|
      [conjunction, detail[:attempts].group_by(&:attempt).map do |attempt_number, attempt|
        [attempt_number, attempt.map(&:serialize_by_activity_session_detail)]
      end.to_h]
    end.to_h.symbolize_keys

    prompt_groups.each do |conjunction, _|
      prompt_groups[conjunction][:attempts] = attempt_groups[conjunction]
    end
    
    output[:prompts] = prompt_groups
    output.symbolize_keys
  end
end
