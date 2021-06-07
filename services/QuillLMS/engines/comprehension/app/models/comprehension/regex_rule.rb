module Comprehension
  class RegexRule < ActiveRecord::Base
    include Comprehension::ChangeLog

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

    # after_create :log_creation
    # after_destroy :log_deletion
    # after_update :log_update, if: :regex_text_changed?

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :rule_id, :regex_text, :case_sensitive, :sequence_type]
      ))
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
        false
      end
    end

    private def log_creation
      rule.log_update({regex_text: regex_text})
    end

    private def log_deletion
      rule.log_update({regex_text: nil}, {regex_text: regex_text})
    end

    private def log_update
      rule.log_update({regex_text: regex_text_change[1]}, {regex_text: regex_text_change[0]})
    end
  end
end
