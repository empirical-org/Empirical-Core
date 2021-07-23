module Comprehension
  class Highlight < ApplicationRecord
    include Comprehension::ChangeLog
    
    MIN_TEXT_LENGTH = 1
    MAX_TEXT_LENGTH = 5000
    TYPES= [
      'passage',
      'response',
      'prompt'
    ]

    belongs_to :feedback, inverse_of: :highlights

    validates :text, presence: true, length: {minimum: MIN_TEXT_LENGTH, maximum: MAX_TEXT_LENGTH}
    validates :highlight_type, presence: true, inclusion: {in: TYPES}
    validates :starting_index, numericality: {only_integer: true, greater_than_or_equal_to: 0}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :feedback_id, :text, :highlight_type, :starting_index]
      ))
    end

    def change_log_name
      if semantic_rule && first_order
        "Semantic Label First Layer Feedback Highlight"
      elsif semantic_rule && second_order
        "Semantic Label Second Layer Feedback Highlight"
      elsif feedback.rule.plagiarism?
        "Plagiarism Rule Highlight"
      elsif feedback.rule.regex?
        "Regex Rule Highlight"
      else
        "Highlight"
      end
    end

    def url
      feedback.rule.url
    end

    def comprehension_name
      feedback.rule.name
    end

    def conjunctions
      feedback.rule.prompts.map(&:conjunction)
    end

    private def semantic_rule
      feedback.rule.rule_type == Rule::TYPE_AUTOML
    end

    private def first_order
      feedback.order == 0
    end

    private def second_order
      feedback.order == 1
    end
  end
end
