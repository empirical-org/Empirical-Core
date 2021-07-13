module Comprehension
  class Highlight < ActiveRecord::Base
    include Comprehension::ChangeLog

    MIN_TEXT_LENGTH = 1
    MAX_TEXT_LENGTH = 5000
    TYPES= [
      'passage',
      'response',
      'prompt'
    ]

    belongs_to :feedback, inverse_of: :highlights
    has_many :change_logs

    validates :text, presence: true, length: {minimum: MIN_TEXT_LENGTH, maximum: MAX_TEXT_LENGTH}
    validates :highlight_type, presence: true, inclusion: {in: TYPES}
    validates :starting_index, numericality: {only_integer: true, greater_than_or_equal_to: 0}

    after_save :log_update

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :feedback_id, :text, :highlight_type, :starting_index]
      ))
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

    def log_update
      if text_changed?
        if semantic_rule && first_order
          log_change(nil, :update_highlight_1, self, {url: feedback.rule.url}.to_json, "text", text_was, text)
        elsif semantic_rule && second_order
          log_change(nil, :update_highlight_2, self, {url: feedback.rule.url}.to_json, "text", text_was, text)
        elsif feedback.rule.plagiarism?
          log_change(nil, :update_plagiarism_highlight, self, {url: feedback.rule.url}.to_json, "text", text_was, text)
        elsif feedback.rule.regex?
          log_change(nil, :update_regex_highlight, self, {url: feedback.rule.url}.to_json, "text", text_was, text)
        end
      end
    end
  end
end
