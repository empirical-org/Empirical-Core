# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_rules
#
#  id          :integer          not null, primary key
#  concept_uid :string
#  name        :string           not null
#  note        :string
#  optimal     :boolean          not null
#  rule_type   :string           not null
#  state       :string           not null
#  suborder    :integer
#  uid         :string           not null
#  universal   :boolean          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  hint_id     :bigint
#
# Indexes
#
#  index_comprehension_rules_on_hint_id  (hint_id)
#  index_comprehension_rules_on_uid      (uid) UNIQUE
#
module Evidence
  class Rule < ApplicationRecord
    self.table_name = 'comprehension_rules'

    include Evidence::ChangeLog

    attr_accessor :first_feedback

    MAX_NAME_LENGTH = 250
    ALLOWED_BOOLEANS = [true, false]
    STATES = [
      STATE_ACTIVE = 'active',
      STATE_INACTIVE = 'inactive'
    ]
    TYPES = [
      TYPE_AUTOML       = 'autoML',
      TYPE_GEN_AI       = 'genAI',
      TYPE_ERROR        = 'error',
      TYPE_GRAMMAR      = 'grammar',
      TYPE_OPINION      = 'opinion',
      TYPE_PLAGIARISM   = 'plagiarism',
      TYPE_PREFILTER    = 'prefilter',
      TYPE_REGEX_ONE    = 'rules-based-1',
      TYPE_REGEX_TWO    = 'rules-based-2',
      TYPE_REGEX_THREE  = 'rules-based-3',
      TYPE_SPELLING     = 'spelling',
      TYPE_LOW_CONFIDENCE = 'low-confidence'
    ]
    DISPLAY_NAMES = {
      'rules-based-1': 'Sentence Structure Regex',
      'rules-based-2': 'Post-Topic Regex',
      'rules-based-3': 'Typo Regex',
      'plagiarism': 'Plagiarism',
      'low-confidence': 'Low Confidence'
    }

    after_create :assign_to_all_prompts, if: :universal
    before_validation :assign_uid_if_missing
    validate :one_plagiarism_per_prompt, on: :create, if: :plagiarism?
    validate :one_low_confidence_per_prompt, on: :create, if: :low_confidence?

    has_many :feedbacks, inverse_of: :rule, dependent: :destroy
    has_many :plagiarism_texts, inverse_of: :rule, dependent: :destroy
    has_one :label, inverse_of: :rule, dependent: :destroy
    has_many :prompts_rules, inverse_of: :rule
    has_many :prompts, through: :prompts_rules, inverse_of: :rules

    has_many :regex_rules, inverse_of: :rule, dependent: :destroy
    has_many :required_sequences, -> { required_sequences }, class_name: 'Evidence::RegexRule'
    has_many :incorrect_sequences, -> { incorrect_sequences }, class_name: 'Evidence::RegexRule'

    belongs_to :hint, inverse_of: :rules

    accepts_nested_attributes_for :plagiarism_texts, allow_destroy: true
    accepts_nested_attributes_for :feedbacks, allow_destroy: true
    accepts_nested_attributes_for :label
    accepts_nested_attributes_for :regex_rules

    validates :uid, presence: true, uniqueness: true
    validates :name, presence: true, length: {maximum: MAX_NAME_LENGTH}
    validates :universal, inclusion: ALLOWED_BOOLEANS
    validates :optimal, inclusion: ALLOWED_BOOLEANS
    validates :rule_type, inclusion: {in: TYPES}
    validates :state, inclusion: {in: STATES}
    validates :suborder, numericality: {allow_blank: true, only_integer: true, greater_than_or_equal_to: 0}

    scope :active, -> {where(state: STATE_ACTIVE)}
    scope :auto_ml, -> {where(rule_type: TYPE_AUTOML)}
    scope :optimal, -> {where(optimal: true)}
    scope :suboptimal, -> {where(optimal: false)}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :uid, :name, :note, :universal, :rule_type, :optimal, :state, :suborder, :concept_uid, :prompt_ids],
        include: [:plagiarism_texts, :feedbacks, :label, :regex_rules, :hint],
        methods: [:prompt_ids, :display_name, :conditional]
      ))
    end

    def determine_feedback_from_history(feedback_history)
      return feedbacks.order(:order).first if feedback_history.blank?

      relevant_history = feedback_history.filter { |fb| fb['feedback_type'] == rule_type }
      relevant_feedback_text = relevant_history.map { |fb| fb['feedback'] }

      first_unused = feedbacks.where.not(text: relevant_feedback_text).order(:order).first
      return first_unused || feedbacks.order(order: :desc).first
    end

    def regex_is_passing?(entry)
      return true if incorrect_sequences.empty? && required_sequences.empty?

      grade_sequences(entry)
    end

    def grade_sequences(entry)
      return true if all_incorrect_sequences_passing?(entry) && one_non_conditional_required_sequences_passing?(entry)

      at_least_one_conditional_required_sequence_passing?(entry)
    end

    def display_name
      DISPLAY_NAMES[rule_type.to_sym] || rule_type
    end

    def plagiarism?
      rule_type == TYPE_PLAGIARISM
    end

    def low_confidence?
      rule_type == TYPE_LOW_CONFIDENCE
    end

    def regex?
      rule_type == TYPE_REGEX_ONE || rule_type == TYPE_REGEX_TWO || rule_type == TYPE_REGEX_THREE
    end

    def automl?
      rule_type == TYPE_AUTOML
    end

    def universal_rule_type?
      rule_type == TYPE_SPELLING || rule_type == TYPE_GRAMMAR
    end

    def universal?
      universal
    end

    def change_log_name
      if regex?
        "Regex Rule"
      elsif plagiarism?
        "Plagiarism Rule"
      elsif automl?
        "Semantic Label"
      elsif universal_rule_type?
        "Universal Rule"
      elsif low_confidence?
        "Low Confidence Rule"
      else
        "Rule"
      end
    end

    def url
      if regex?
        "evidence/#/activities/#{activity_id}/regex-rules/#{id}"
      elsif universal?
        "evidence/#/universal-rules/#{id}"
      elsif plagiarism?
        "evidence/#/activities/#{activity_id}/plagiarism-rules/#{id}"
      elsif low_confidence?
        "evidence/#/activities/#{activity_id}/low-confidence-rules/#{id}"
      elsif automl?
        "evidence/#/activities/#{activity_id}/semantic-labels/#{prompt_id}/#{id}"
      else
        ""
      end
    end

    def evidence_name
      name
    end

    def conjunctions
      return nil if universal_rule_type?

      prompts.map(&:conjunction)
    end

    def conditional
      return nil if !regex? || regex_rules.empty?

      return regex_rules.all? { |r| r.conditional? }
    end

    private def all_incorrect_sequences_passing?(entry)
      return true if incorrect_sequences.empty?

      incorrect_sequences.none? do |regex_rule|
        regex_rule.entry_failing?(entry)
      end
    end

    private def at_least_one_conditional_required_sequence_passing?(entry)
      required_sequences.select(&:conditional).any? do |regex_rule|
        !regex_rule.entry_failing?(entry)
      end
    end

    private def one_non_conditional_required_sequences_passing?(entry)
      return true if required_sequences.select(&:unconditional).empty?

      required_sequences.select(&:unconditional).any? do |regex_rule|
        !regex_rule.entry_failing?(entry)
      end
    end

    private def assign_uid_if_missing
      self.uid ||= SecureRandom.uuid
    end

    private def assign_to_all_prompts
      unassigned_prompts = Prompt.all - prompts

      prompts_rules.create!(unassigned_prompts.map { |prompt| { prompt: prompt } })
    end

    private def one_plagiarism_per_prompt
      prompts.each do |prompt|
        errors.add(:prompts, "prompt #{prompt.id} already has a plagiarism rule") if prompt.rules.where(rule_type: TYPE_PLAGIARISM).first&.id
      end
    end

    private def one_low_confidence_per_prompt
      prompts.each do |prompt|
        errors.add(:prompts, "prompt #{prompt.id} already has a low confidence rule") if prompt.rules.where(rule_type: TYPE_LOW_CONFIDENCE).first&.id
      end
    end

    private def activity_id
      prompts&.first&.activity&.id
    end

    private def prompt_id
      prompts&.first&.id
    end
  end
end
