module Comprehension
  class RuleSet < ActiveRecord::Base
    MAX_NAME_LENGTH = 100
    MAX_FEEDBACK_LENGTH = 500
    MIN_PRIORITY = 0

    belongs_to :activity, inverse_of: :rule_sets
    has_many :prompts_rule_sets
    has_many :prompts, through: :prompts_rule_sets, inverse_of: :rule_sets
    has_many :regex_rules, inverse_of: :rule_set, dependent: :destroy

    accepts_nested_attributes_for :regex_rules, reject_if: proc { |r| r['regex_text'].blank? }

    validates_presence_of :activity
    validates :name, presence: true, length: {maximum: MAX_NAME_LENGTH}
    validates :feedback, presence: true, length: {maximum: MAX_FEEDBACK_LENGTH}
    validates :priority, uniqueness: { scope: :activity_id },
      numericality: { only_integer: true, greater_than_or_equal_to: MIN_PRIORITY }

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :activity_id, :name, :feedback, :priority],
        include: {
          regex_rules: {},
          prompts: { only: [:id, :conjunction] }
        }
      ))
    end
  end
end
