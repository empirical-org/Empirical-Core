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

    private def log_update
      if text_changed?
        if semantic_rule && first_order
          send_change_log(:update_highlight_1)
        elsif semantic_rule && second_order
          send_change_log(:update_highlight_2)
        elsif feedback.rule.plagiarism?
          send_change_log(:update_plagiarism_highlight)
        elsif feedback.rule.regex?
          send_change_log(:update_regex_highlight)
        end
      end
    end

    private def send_change_log(action)
      log_change(nil, action, self, {url: feedback.rule.url}.to_json, "text", text_was, text)
    end
  end
end
