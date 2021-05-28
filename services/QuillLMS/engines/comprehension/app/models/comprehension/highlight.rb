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

    validates :text, presence: true, length: {minimum: MIN_TEXT_LENGTH, maximum: MAX_TEXT_LENGTH}
    validates :highlight_type, presence: true, inclusion: {in: TYPES}
    validates :starting_index, numericality: {only_integer: true, greater_than_or_equal_to: 0}

    after_update :log_first_update, if: -> {semantic_rule && first_order && text_changed?}
    after_update :log_second_update, if: -> {semantic_rule && second_order && text_changed?}

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

    private def log_first_update
      feedback&.rule&.prompts&.each do |prompt|
        log_change(:update_feedback_1, prompt, nil, nil, change_text(0), change_text(1))
      end
    end

    private def log_second_update
      feedback&.rule&.prompts&.each do |prompt|
        log_change(:update_feedback_2, prompt, nil, nil, change_text(0), change_text(1))
      end
    end

    private def change_text(change_index)
      "#{feedback&.rule&.label&.name} | #{feedback&.rule&.name}\n#{text_change[change_index]}"
    end
  end
end
