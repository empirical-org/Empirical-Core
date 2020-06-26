module Comprehension
  class Rule < ActiveRecord::Base
    DEFAULT_CASE_SENSITIVITY = true
    MAX_REGEX_TEXT_LENGTH = 200

    belongs_to :rule_set, inverse_of: :rules

    before_validation :set_default_case_sensitivity, on: :create

    validates_presence_of :rule_set
    validates :regex_text, presence: true, length: {maximum: MAX_REGEX_TEXT_LENGTH}
    validates :case_sensitive, presence: true

    # FIXME, fill in attributes for json
    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :regex_text, :case_sensitive]
      ))
    end

    private def set_default_case_sensitivity
      self.case_sensitive = case_sensitive || DEFAULT_CASE_SENSITIVITY
    end
  end
end
