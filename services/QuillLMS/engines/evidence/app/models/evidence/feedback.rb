module Evidence
  class Feedback < ApplicationRecord
    self.table_name = 'comprehension_feedbacks'

    include Evidence::ChangeLog
    MIN_FEEDBACK_LENGTH = 10
    MAX_FEEDBACK_LENGTH = 500

    belongs_to :rule, inverse_of: :feedbacks
    has_many :highlights, inverse_of: :feedback, dependent: :destroy

    accepts_nested_attributes_for :highlights, allow_destroy: true

    validates_presence_of :rule
    validates :text, presence: true, length: {minimum: MIN_FEEDBACK_LENGTH, maximum: MAX_FEEDBACK_LENGTH}
    validates :order, numericality: {only_integer: true, greater_than_or_equal_to: 0}, uniqueness: {scope: :rule_id}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :rule_id, :text, :description, :order],
        include: [:highlights]
      ))
    end

    def change_log_name
      if semantic_rule && first_order
        "Semantic Label First Layer Feedback"
      elsif semantic_rule && second_order
        "Semantic Label Second Layer Feedback"
      elsif rule.plagiarism?
        "Plagiarism Rule Feedback"
      elsif rule.regex?
        "Regex Rule Feedback"
      else
        "Feedback"
      end
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

    private def semantic_rule
      rule.rule_type == Rule::TYPE_AUTOML
    end

    private def first_order
      order == 0
    end

    private def second_order
      order == 1
    end
  end
end
