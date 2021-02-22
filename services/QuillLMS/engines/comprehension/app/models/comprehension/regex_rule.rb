module Comprehension
  class RegexRule < ActiveRecord::Base
    DEFAULT_CASE_SENSITIVITY = true
    MAX_REGEX_TEXT_LENGTH = 200
    CASE_SENSITIVE_ALLOWED_VALUES = [true, false]

    belongs_to :rule, inverse_of: :regex_rules

    before_validation :set_default_case_sensitivity, on: :create
    before_save :validate_regex

    validates_presence_of :rule
    validates :regex_text, presence: true, length: {maximum: MAX_REGEX_TEXT_LENGTH}
    validates :case_sensitive, inclusion: CASE_SENSITIVE_ALLOWED_VALUES

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :rule_id, :regex_text, :case_sensitive]
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
        self.rule.errors.add(:error, "Invalid regex: #{e}")
        false
      end
    end
  end
end
