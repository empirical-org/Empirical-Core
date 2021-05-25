module Comprehension
  class Rule < ActiveRecord::Base
    attr_accessor :first_feedback
    MAX_NAME_LENGTH = 250
    ALLOWED_BOOLEANS = [true, false]
    STATES = [
      STATE_ACTIVE = 'active',
      STATE_INACTIVE = 'inactive'
    ]
    TYPES= [
      TYPE_AUTOML = 'autoML',
      TYPE_GRAMMAR = 'grammar',
      TYPE_OPINION = 'opinion',
      TYPE_PLAGIARISM = 'plagiarism',
      TYPE_REGEX_ONE = 'rules-based-1',
      TYPE_REGEX_TWO = 'rules-based-2',
      TYPE_REGEX_THREE = 'rules-based-3',
      TYPE_SPELLING = 'spelling'
    ]
    DISPLAY_NAMES = {
      'rules-based-1': 'Sentence Structure Regex',
      'rules-based-2': 'Post-Topic Regex',
      'rules-based-3': 'Typo Regex',
      'plagiarism': 'Plagiarism'
    }

    after_create :assign_to_all_prompts, if: :universal
    before_validation :assign_uid_if_missing
    validate :one_plagiarism_per_prompt, on: :create, if: :plagiarism?

    has_many :feedbacks, inverse_of: :rule, dependent: :destroy
    has_one :plagiarism_text, inverse_of: :rule, dependent: :destroy
    has_one :label, inverse_of: :rule, dependent: :destroy
    has_many :prompts_rules, inverse_of: :rule
    has_many :prompts, through: :prompts_rules, inverse_of: :rules
    has_many :regex_rules, inverse_of: :rule, dependent: :destroy

    accepts_nested_attributes_for :plagiarism_text
    accepts_nested_attributes_for :feedbacks
    accepts_nested_attributes_for :label
    accepts_nested_attributes_for :regex_rules

    validates :uid, presence: true, uniqueness: true
    validates :name, presence: true, length: {maximum: MAX_NAME_LENGTH}
    validates :universal, inclusion: ALLOWED_BOOLEANS
    validates :optimal, inclusion: ALLOWED_BOOLEANS
    validates :rule_type, inclusion: {in: TYPES}
    validates :state, inclusion: {in: STATES}
    validates :suborder, numericality: {allow_blank: true, only_integer: true, greater_than_or_equal_to: 0}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :uid, :name, :note, :universal, :rule_type, :optimal, :state, :suborder, :concept_uid, :prompt_ids],
        include: [:plagiarism_text, :feedbacks, :label, :regex_rules],
        methods: [:prompt_ids, :display_name]
      ))
    end

    def determine_feedback_from_history(feedback_history)
      relevant_history = feedback_history.filter { |fb| fb['feedback_type'] == rule_type }
      relevant_feedback_text = relevant_history.map { |fb| fb['feedback'] }

      first_unused = feedbacks.where.not(text: relevant_feedback_text).order(:order).first
      return first_unused || feedbacks.order(order: :desc).first
    end

    def regex_is_passing?(entry)
      regex_rules.none? do |regex_rule|
        is_matching = match_with_case_sensitive(regex_rule.regex_text, regex_rule.case_sensitive, entry)
        regex_rule.sequence_type == RegexRule::TYPE_INCORRECT ? is_matching : !is_matching
      end
    end

    def display_name
      DISPLAY_NAMES[rule_type.to_sym] || rule_type
    end

    private def match_with_case_sensitive(regex, is_case_sensitive, text)
      is_case_sensitive ? Regexp.new(regex).match(text) : Regexp.new(regex, Regexp::IGNORECASE).match(text)
    end

    private def plagiarism?
      rule_type == TYPE_PLAGIARISM
    end

    private def assign_uid_if_missing
      self.uid ||= SecureRandom.uuid
    end

    private def assign_to_all_prompts
      Prompt.all.each do |prompt|
        unless prompts.include?(prompt)
          prompts.append(prompt)
        end
      end
      save!
    end

    private def one_plagiarism_per_prompt
      prompts.each do |prompt|
        errors.add(:prompts, "prompt #{prompt.id} already has a plagiarism rule") if prompt.rules.where(rule_type: TYPE_PLAGIARISM).first&.id
      end
    end
  end
end
