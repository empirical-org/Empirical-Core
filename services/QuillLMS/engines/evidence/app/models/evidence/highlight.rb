# frozen_string_literal: true

module Evidence
  class Highlight < ApplicationRecord
    self.table_name = 'comprehension_highlights'

    include Evidence::ChangeLog

    MIN_TEXT_LENGTH = 1
    MAX_TEXT_LENGTH = 5000

    TYPES = [
      TYPE_PASSAGE = 'passage',
      TYPE_RESPONSE = 'response',
      TYPE_PROMPT = 'prompt'
    ]
    belongs_to :feedback, inverse_of: :highlights

    validates :text, presence: true, length: {minimum: MIN_TEXT_LENGTH, maximum: MAX_TEXT_LENGTH}
    validates :highlight_type, presence: true, inclusion: {in: TYPES}
    validates :starting_index, numericality: {only_integer: true, greater_than_or_equal_to: 0}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :feedback_id, :text, :highlight_type, :starting_index],
        methods: [:valid_in_all_targets]
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

    def evidence_name
      feedback.rule.name
    end

    def conjunctions
      feedback.rule.prompts.map(&:conjunction)
    end

    def valid_in_all_targets
      !invalid_activity_ids
    end

    def invalid_activity_ids
      return unless highlight_type == 'passage'

      related_passages = feedback.rule.prompts.map(&:activity).uniq.map(&:passages).flatten
      invalid_ids = related_passages.reject {|p| strip_tags(p.text).include?(strip_tags(text))}.map {|p| p.activity.id}
      return if invalid_ids.empty?

      invalid_ids
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

    private def strip_tags(input)
      ::ActionController::Base.helpers.strip_tags(input)
    end
  end
end
