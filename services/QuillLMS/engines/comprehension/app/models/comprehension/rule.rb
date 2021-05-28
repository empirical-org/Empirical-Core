module Comprehension
  class Rule < ActiveRecord::Base
    include Comprehension::ChangeLog

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
    after_create :log_regex_creation, if: :regex?
    after_create :log_universal_creation, if: :universal?
    after_create :log_plagiarism_creation, if: :plagiarism?
    after_update :log_regex_update, if: :regex?
    after_update :log_plagiarism_update, if: :plagiarism?
    after_update :log_universal_update, if: :universal?
    after_destroy :log_regex_deletion, if: :regex?
    before_validation :assign_uid_if_missing
    validate :one_plagiarism_per_prompt, on: :create, if: :plagiarism?

    has_many :feedbacks, inverse_of: :rule, dependent: :destroy
    has_one :plagiarism_text, inverse_of: :rule, dependent: :destroy
    has_one :label, inverse_of: :rule, dependent: :destroy
    has_many :prompts_rules, inverse_of: :rule
    has_many :prompts, through: :prompts_rules, inverse_of: :rules
    has_many :regex_rules, inverse_of: :rule, dependent: :destroy
    has_many :change_logs

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
        regex_rule.sequence_type == RegexRule::TYPE_INCORRECT ? Regexp.new(regex_rule.regex_text).match(entry) : !Regexp.new(regex_rule.regex_text).match(entry)
      end
    end

    def display_name
      DISPLAY_NAMES[rule_type.to_sym] || rule_type
    end

    private def plagiarism?
      rule_type == TYPE_PLAGIARISM
    end

    private def regex?
      rule_type == TYPE_REGEX_ONE || rule_type == TYPE_REGEX_TWO || rule_type == TYPE_REGEX_THREE
    end

    private def universal?
      universal
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

    private def log_regex_creation
      prompts&.each do |prompt|
        log_change(:create_regex, prompt, nil, nil, nil, change_text_regex)
      end
    end

    private def log_universal_creation
      prompts&.each do |prompt|
        log_change(:create_universal, prompt, nil, nil, nil, "#{name} - #{rule_type}")
      end
    end

    private def log_plagiarism_creation
      prompts&.each do |prompt|
        log_change(:create_plagiarism, prompt, nil, nil, nil, change_text_plagiarism)
      end
    end

    private def log_regex_update
      prompts&.each do |prompt|
        log_change(:update_regex, prompt, nil, nil, change_text_regex(filtered_changes.transform_values {|v| v[0]}), change_text_regex(filtered_changes.transform_values {|v| v[1]}))
      end
    end

    private def log_plagiarism_update
      prompts&.each do |prompt|
        log_change(:update_plagiarism, prompt, nil, nil, change_text_plagiarism(filtered_changes.transform_values {|v| v[0]}), change_text_regex(filtered_changes.transform_values {|v| v[1]}))
      end
    end

    private def log_universal_update
      prompts&.each do |prompt|
        log_change(:update_universal, prompt, nil, nil, "#{name} - #{rule_type}\n#{filtered_changes.transform_values {|v| v[0]}}", "#{name} - #{rule_type}\n#{filtered_changes.transform_values {|v| v[1]}}")
      end
    end

    private def log_regex_deletion
      prompts&.each do |prompt|
        log_change(:delete_regex, prompt, nil, nil, change_text_regex, nil)
      end
    end

    private def filtered_changes
      changes.except(:updated_at)
    end

    private def change_text_regex(values=nil)
      values.present? ? "#{name} | #{display_name}\n#{values}" : "#{name} | #{display_name}"
    end

    private def change_text_plagiarism(values=nil)
      values.present? ? "#{name} - #{plagiarism_text.text} - #{feedbacks.first.text}\n#{values}" : "#{name} - #{plagiarism_text.text} - #{feedbacks.first.text}"
    end
  end
end
