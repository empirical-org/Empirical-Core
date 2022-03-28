# frozen_string_literal: true

module Evidence
  class RegexRule < ApplicationRecord
    self.table_name = 'comprehension_regex_rules'

    include Evidence::ChangeLog

    DEFAULT_CASE_SENSITIVITY = true
    MAX_REGEX_TEXT_LENGTH = 200
    CASE_SENSITIVE_ALLOWED_VALUES = [true, false]
    SEQUENCE_TYPES = [
      TYPE_INCORRECT = 'incorrect',
      TYPE_REQUIRED = 'required'
    ]

    belongs_to :rule, inverse_of: :regex_rules

    before_validation :set_default_case_sensitivity, on: :create
    before_save :validate_regex

    validates_presence_of :rule
    validates :regex_text, presence: true, length: {maximum: MAX_REGEX_TEXT_LENGTH}
    validates :case_sensitive, inclusion: CASE_SENSITIVE_ALLOWED_VALUES
    validates :sequence_type, inclusion: SEQUENCE_TYPES

    scope :required_sequences, -> { where(sequence_type: TYPE_REQUIRED) }
    scope :incorrect_sequences, -> { where(sequence_type: TYPE_INCORRECT) }

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :rule_id, :regex_text, :case_sensitive, :sequence_type, :conditional]
      ))
    end

    def entry_failing?(entry)
      # for "incorrect" type regex rules, we want to "fail" if they have the regex. for "required" type regex
      # rules, we want to "fail" when they dont have the regex.
      sequence_type == TYPE_INCORRECT ? regex_match(entry) : !regex_match(entry)
    end

    def incorrect_sequence?
      sequence_type == TYPE_INCORRECT
    end

    def change_log_name
      "Regex Rule Regex"
    end

    def unconditional
      !conditional
    end

    def url
      rule.url
    end

    def evidence_name
      rule.name
    end

    def conjunctions
      rule.prompts.map(&:conjunction)
    end

    private def regex_match(entry)
      case_sensitive? ? Regexp.new(regex_text).match(entry) : Regexp.new(regex_text, Regexp::IGNORECASE).match(entry)
    end

    private def set_default_case_sensitivity
      return if case_sensitive.in? CASE_SENSITIVE_ALLOWED_VALUES

      self.case_sensitive = DEFAULT_CASE_SENSITIVITY
    end

    private def validate_regex
      begin
        Regexp.new(regex_text)
      rescue RegexpError => e
        rule.errors.add(:invalid_regex, e.to_s)
        throw(:abort)
      end
    end

    private def log_creation
      log_change(nil, :update, self, "regex_text", nil, regex_text)
    end

    private def log_update
      return unless saved_change_to_regex_text?

      log_change(nil, :update, self, "regex_text", regex_text_before_last_save, regex_text)
    end
  end
end
