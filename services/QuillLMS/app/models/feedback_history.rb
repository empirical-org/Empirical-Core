# frozen_string_literal: true

# == Schema Information
#
# Table name: feedback_histories
#
#  id                   :integer          not null, primary key
#  activity_version     :integer          default(1), not null
#  attempt              :integer          not null
#  concept_uid          :text
#  entry                :text             not null
#  feedback_session_uid :text
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
#  index_feedback_histories_on_concept_uid           (concept_uid)
#  index_feedback_histories_on_feedback_session_uid  (feedback_session_uid)
#  index_feedback_histories_on_prompt_type_and_id    (prompt_type,prompt_id)
#  index_feedback_histories_on_rule_uid              (rule_uid)
#
class FeedbackHistory < ApplicationRecord
  CONCEPT_UID_LENGTH = 22
  DEFAULT_PAGE_SIZE = 25
  DEFAULT_PROMPT_TYPE = 'Evidence::Prompt'
  DEFAULT_VERSION = 1
  MIN_ATTEMPT = 1
  MAX_ATTEMPT = 5
  MIN_FEEDBACK_LENGTH = 10
  MAX_FEEDBACK_LENGTH = 500
  FEEDBACK_TYPES = [
    ERROR = 'error',
    GRAMMAR = 'grammar',
    PLAGIARISM = 'plagiarism',
    RULES_BASED_ONE = 'rules-based-1',
    RULES_BASED_TWO = 'rules-based-2',
    RULES_BASED_THREE = 'rules-based-3',
    GEN_AI = 'genAI',
    AUTO_ML = 'autoML',
    SPELLING = 'spelling',
    OPINION = 'opinion',
    PREFILTER = 'prefilter',
    LOW_CONFIDENCE = 'low-confidence'
  ]
  FILTER_TYPES = [
    FILTER_ALL = 'all',
    FILTER_SCORED =  'scored',
    FILTER_UNSCORED =  'unscored',
    FILTER_WEAK =  'weak',
    FILTER_COMPLETE =  'complete',
    FILTER_INCOMPLETE =  'incomplete'
  ]
  CONJUNCTIONS = [
    BECAUSE =  'because',
    BUT =  'but',
    SO =  'so'
  ]

  after_commit :initiate_flag_worker, on: :create
  before_create :anonymize_session_uid
  before_validation :confirm_prompt_type, on: :create

  belongs_to :feedback_session, foreign_key: :feedback_session_uid, primary_key: :uid
  has_one :activity_session, through: :feedback_session
  has_one :student_problem_report
  has_many :feedback_history_ratings
  has_many :feedback_history_flags
  belongs_to :prompt, polymorphic: true
  belongs_to :concept, foreign_key: :concept_uid, primary_key: :uid

  validates :feedback_session_uid, presence: true
  validates :concept_uid, allow_blank: true, length: {is: CONCEPT_UID_LENGTH}
  validates :attempt, presence: true,
    numericality: {
      only_integer: true,
      less_than_or_equal_to: MAX_ATTEMPT,
      greater_than_or_equal_to: MIN_ATTEMPT
    }
  validates :entry, presence: true
  validates :feedback_text, length: {in: MIN_FEEDBACK_LENGTH..MAX_FEEDBACK_LENGTH}
  validates :feedback_type, presence: true, inclusion: {in: FEEDBACK_TYPES}
  validates :optimal, inclusion: { in: [true, false] }
  validates :time, presence: true
  validates :used, inclusion: { in: [true, false] }

  scope :used,  -> { where(used: true) }
  scope :optimal,  -> { where(optimal: true) }
  scope :suboptimal,  -> { where(optimal: false) }
  scope :autoML, -> { where(feedback_type: AUTO_ML)}
  scope :confidence_greater_than, ->(lower_limit) {where("CAST(metadata->'api'->'confidence' AS DOUBLE PRECISION) > ?", lower_limit)}
  scope :entry_shorter_than, ->(length) { where('LENGTH(entry) < ?', length) }
  scope :for_prompt, ->(prompt_id) { where(prompt_id: prompt_id) }

  def readonly?
    !new_record?
  end

  def self.optimal_sample(prompt_id:, confidence_limit: 0.90, max_length: 100, limit: 20)
    optimal
      .autoML
      .for_prompt(prompt_id)
      .confidence_greater_than(confidence_limit)
      .entry_shorter_than(max_length)
      .order('id DESC')
      .limit(limit)
      .pluck(:entry)
      .uniq
  end

  def self.suboptimal_sample(prompt_id:, confidence_limit: 0.90, max_length: 100, limit: 20, offset: 0)
    suboptimal
      .autoML
      .for_prompt(prompt_id)
      .confidence_greater_than(confidence_limit)
      .entry_shorter_than(max_length)
      .order('id DESC')
      .limit(limit)
      .offset(offset)
      .pluck(:entry)
      .uniq
  end

  def concept_results_hash
    return {} if concept.blank?

    {
      concept_uid: concept_uid,
      activity_session_id: activity_session&.id,
      activity_classification_id: ActivityClassification.evidence.id,
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
      only: [:id, :feedback_session_uid, :concept_uid, :attempt, :entry, :optimal, :used,
             :feedback_text, :feedback_type, :time, :metadata, :rule_uid],
      include: [:prompt]
    ))
  end

  def serialize_by_activity_session
    serializable_hash(only: [:session_uid, :start_date, :activity_id, :flags, :because_attempts, :because_optimal, :but_attempts, :but_optimal, :so_attempts, :so_optimal, :scored_count, :weak_count, :strong_count, :complete], include: []).symbolize_keys
  end

  def serialize_by_activity_session_detail
    serializable_hash(only: [:id, :entry, :feedback_text, :feedback_type, :optimal, :used, :rule_uid], include: [], methods: [:most_recent_rating]).symbolize_keys
  end

  def serialize_csv_data
    serializable_hash(only: [:session_uid, :datetime, :conjunction, :optimal, :attempt, :response, :feedback, :feedback_type, :name], include: [])
  end

  def most_recent_rating
    feedback_history_ratings.order(updated_at: :desc).first&.rating
  end

  # TODO: consider making this a background job.
  def self.save_feedback(
    feedback_hash_raw:,
    entry:,
    prompt_id:,
    activity_session_uid:,
    attempt:,
    activity_version: DEFAULT_VERSION,
    api_metadata: nil
  )
    feedback_hash = feedback_hash_raw.deep_stringify_keys

    # Remove blank values from metadata
    metadata = {
      api: api_metadata,
      highlight: feedback_hash['highlight'],
      hint: feedback_hash['hint']
    }.reject {|_,v| v.blank? }

    # NB, there is a before_create that swaps activity_session_uid for a feedback_session.uid
    create(
      feedback_session_uid: activity_session_uid,
      prompt_id: prompt_id,
      attempt: attempt,
      entry: entry,
      used: true,
      time: Time.current,
      rule_uid: feedback_hash['rule_uid'],
      concept_uid: feedback_hash['concept_uid'],
      feedback_text: feedback_hash['feedback'],
      feedback_type: feedback_hash['feedback_type'],
      optimal: feedback_hash['optimal'],
      metadata: metadata,
      activity_version: activity_version
    )
  end

  def rule_violation_repititions?
    histories_from_same_session.where(rule_uid: rule_uid)
      .where('attempt < ?', attempt)
      .count > 0
  end

  def rule_violation_consecutive_repititions?
    histories_from_same_session.where(rule_uid: rule_uid)
      .where(attempt: attempt - 1)
      .count > 0
  end

  def spelling_or_grammar? = feedback_type.in?([GRAMMAR, RULES_BASED_THREE, SPELLING])

  private def initiate_flag_worker
    SetFeedbackHistoryFlagsWorker.perform_async(id)
  end

  private def histories_from_same_session
    FeedbackHistory.where(feedback_session_uid: feedback_session_uid, prompt_id: prompt_id, used: true)
      .where.not(id: id)
  end

  def self.batch_create(param_array)
    param_array.map { |params| create(params) }
  end

  private def confirm_prompt_type
    self.prompt_type = DEFAULT_PROMPT_TYPE if prompt_id && !prompt_type
  end

  private def anonymize_session_uid
    self.feedback_session_uid = FeedbackSession.get_uid_for_activity_session(feedback_session_uid)
  end

  def self.completeness_filter_query(complete)
    <<-SQL
    (
      CASE WHEN
        ((COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' AND feedback_histories.optimal THEN 1 END) = 1) OR
          (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' THEN comprehension_prompts.max_attempts END))) AND
        ((COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' AND feedback_histories.optimal THEN 1 END) = 1) OR
          (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' THEN comprehension_prompts.max_attempts END))) AND
        ((COUNT(CASE WHEN comprehension_prompts.conjunction = '#{SO}' AND feedback_histories.optimal THEN 1 END) = 1) OR
          (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{SO}' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = '#{SO}' THEN comprehension_prompts.max_attempts END)))
      THEN true ELSE false END
    ) = #{complete}
    SQL
  end

  def self.six_or_more_total_responses
    <<-SQL
    (
      CASE WHEN
        (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' THEN 1 END) +
        COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' THEN 1 END) +
        COUNT(CASE WHEN comprehension_prompts.conjunction = '#{SO}' THEN 1 END)) > 5
      THEN true ELSE false END
    ) = true
    SQL
  end

  def self.two_or_more_responses_per_conjunction
    <<-SQL
    (
      CASE WHEN
        (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' THEN 1 END) > 1 AND
        COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' THEN 1 END) > 1 AND
        COUNT(CASE WHEN comprehension_prompts.conjunction = '#{SO}' THEN 1 END) > 1)
      THEN true ELSE false END
    ) = true
    SQL
  end

  def self.responses_for_scoring
    six_or_more_total_responses || two_or_more_responses_per_conjunction
  end

  # rubocop:disable Lint/DuplicateBranch
  def self.apply_activity_session_filter(query, filter_type)
    case filter_type
    when FILTER_ALL
      query
    when FILTER_SCORED
      query = query.where('feedback_history_ratings.rating IS NOT NULL')
    when FILTER_UNSCORED
      query = query.where('feedback_history_ratings.rating IS NULL')
    when FILTER_WEAK
      query = query.where('feedback_history_ratings.rating IS FALSE')
    when FILTER_COMPLETE
      query = query.having(FeedbackHistory.completeness_filter_query(true))
    when FILTER_INCOMPLETE
      query = query.having(FeedbackHistory.completeness_filter_query(false))
    else
      query
    end
  end
  # rubocop:enable Lint/DuplicateBranch

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.list_by_activity_session(activity_id: nil, page: 1, start_date: nil, end_date: nil, page_size: DEFAULT_PAGE_SIZE, filter_type: nil, responses_for_scoring: false)
    query = select(
      <<-SQL
        feedback_histories.feedback_session_uid AS session_uid,
        MIN(feedback_histories.time) AS start_date,
        comprehension_prompts.activity_id,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT feedback_history_flags.flag), NULL) AS flags,
        COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' THEN 1 END) AS because_attempts,
        BOOL_OR(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' AND feedback_histories.optimal = true THEN true ELSE false END) AS because_optimal,
        COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' THEN 1 END) AS but_attempts,
        BOOL_OR(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' AND feedback_histories.optimal = true THEN true ELSE false END) AS but_optimal,
        COUNT(CASE WHEN comprehension_prompts.conjunction = '#{SO}' THEN 1 END) AS so_attempts,
        BOOL_OR(CASE WHEN comprehension_prompts.conjunction = '#{SO}' AND feedback_histories.optimal = true THEN true ELSE false END) AS so_optimal,
        COUNT(CASE WHEN feedback_history_ratings.rating IS NOT NULL THEN 1 END) AS scored_count,
        COUNT(CASE WHEN feedback_history_ratings.rating = false THEN 1 END) AS weak_count,
        COUNT(CASE WHEN feedback_history_ratings.rating = true THEN 1 END) AS strong_count,
        (
          CASE WHEN
            ((COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' AND feedback_histories.optimal THEN 1 END) = 1) OR
              (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = '#{BECAUSE}' THEN comprehension_prompts.max_attempts END))) AND
            ((COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' AND feedback_histories.optimal THEN 1 END) = 1) OR
              (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = '#{BUT}' THEN comprehension_prompts.max_attempts END))) AND
            ((COUNT(CASE WHEN comprehension_prompts.conjunction = '#{SO}' AND feedback_histories.optimal THEN 1 END) = 1) OR
              (COUNT(CASE WHEN comprehension_prompts.conjunction = '#{SO}' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = '#{SO}' THEN comprehension_prompts.max_attempts END)))
          THEN true ELSE false END
        ) AS complete
      SQL
      )
      .joins('LEFT OUTER JOIN feedback_history_flags ON feedback_histories.id = feedback_history_flags.feedback_history_id')
      .joins('LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id')
      .joins('LEFT OUTER JOIN feedback_history_ratings ON feedback_histories.id = feedback_history_ratings.feedback_history_id')
      .where(used: true)
      .group(:feedback_session_uid, :activity_id)
      .order('start_date DESC')
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = query.where('feedback_histories.created_at >= ?', start_date) if start_date
    query = query.where('feedback_histories.created_at <= ?', end_date) if end_date
    query = FeedbackHistory.apply_activity_session_filter(query, filter_type) if filter_type
    query = query.having(FeedbackHistory.responses_for_scoring) if responses_for_scoring
    query = query.limit(page_size) if page_size
    query = query.offset((page.to_i - 1) * page_size.to_i) if page && page.to_i > 1
    query
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def self.get_total_count(activity_id: nil, start_date: nil, end_date: nil, filter_type: nil, responses_for_scoring: false, activity_version: nil)
    query = FeedbackHistory.select(:feedback_session_uid)
      .joins('LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id')
      .joins('LEFT OUTER JOIN feedback_history_ratings ON feedback_histories.id = feedback_history_ratings.feedback_history_id')
      .group(:feedback_session_uid, :activity_id)
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = query.where('feedback_histories.created_at >= ?', start_date) if start_date
    query = query.where('feedback_histories.created_at <= ?', end_date) if end_date
    query = FeedbackHistory.apply_activity_session_filter(query, filter_type) if filter_type
    query = query.having(FeedbackHistory.responses_for_scoring) if responses_for_scoring
    query = query.where('feedback_histories.activity_version = ?', activity_version) if activity_version
    result = ActiveRecord::Base.connection.execute("SELECT COUNT(*) from (#{query.to_sql}) as nickname")
    result.first['count']
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.serialize_detail_by_activity_session(feedback_session_uid)
    history = FeedbackHistory.list_by_activity_session.where(feedback_session_uid: feedback_session_uid).first
    return nil unless history

    histories = FeedbackHistory.where(feedback_session_uid: feedback_session_uid).all

    output = history.serialize_by_activity_session
    prompt_groups = histories.group_by do |h|
      h&.prompt&.conjunction
    end
    prompt_groups = prompt_groups.transform_values do |attempts|
      {prompt_id: attempts.first.prompt_id, attempts: attempts}
    end.symbolize_keys

    attempt_groups = prompt_groups.transform_values do |detail|
      detail[:attempts].group_by(&:attempt).transform_values do |attempt|
        attempt.map(&:serialize_by_activity_session_detail)
      end
    end.symbolize_keys

    prompt_groups.each do |conjunction, _|
      prompt_groups[conjunction][:attempts] = attempt_groups[conjunction]
    end

    output[:prompts] = prompt_groups
    output.symbolize_keys
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def self.session_data_uids(activity_id: nil, start_date: nil, end_date: nil, filter_type: nil, responses_for_scoring: false)
    query = select(
      <<-SQL
        feedback_histories.feedback_session_uid AS session_uid
      SQL
      )
      .joins('LEFT OUTER JOIN feedback_history_flags ON feedback_histories.id = feedback_history_flags.feedback_history_id')
      .joins('LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id')
      .joins('LEFT OUTER JOIN feedback_history_ratings ON feedback_histories.id = feedback_history_ratings.feedback_history_id')
      .where(used: true)
      .group(:feedback_session_uid)
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = FeedbackHistory.apply_activity_session_filter(query, filter_type) if filter_type
    query = query.having(FeedbackHistory.responses_for_scoring) if responses_for_scoring
    query
  end

  def self.session_data_for_csv(activity_id: nil, start_date: nil, end_date: nil, filter_type: nil, responses_for_scoring: false)
    session_uids = session_data_uids(activity_id: activity_id, filter_type: filter_type, responses_for_scoring: responses_for_scoring)
    query = select(
      <<-SQL
        feedback_histories.id,
        feedback_histories.feedback_session_uid AS session_uid,
        feedback_histories.time AS datetime,
        comprehension_prompts.conjunction,
        feedback_histories.optimal,
        feedback_histories.attempt,
        feedback_histories.entry as response,
        feedback_histories.feedback_text as feedback,
        feedback_histories.feedback_type,
        comprehension_rules.name
      SQL
      )
      .joins('LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id')
      .joins('LEFT OUTER JOIN comprehension_rules ON comprehension_rules.uid = feedback_histories.rule_uid')
      .where(used: true)
      .order('datetime DESC')
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = query.where('feedback_histories.created_at >= ?', start_date) if start_date
    query = query.where('feedback_histories.created_at <= ?', end_date) if end_date
    query = query.where(feedback_session_uid: session_uids) if responses_for_scoring || filter_type
    query
  end
end
