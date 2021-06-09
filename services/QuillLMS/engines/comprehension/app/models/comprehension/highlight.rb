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

    def log_update(user_id, prev_value)
      if semantic_rule && first_order
        feedback&.rule&.prompts&.each do |prompt|
          log_change(user_id, :update_highlight_1, prompt, nil, nil, prev_value, "#{feedback.rule.label.name} | #{feedback.rule.name}\n#{text}")
        end
      elsif semantic_rule && second_order
        feedback&.rule&.prompts&.each do |prompt|
          log_change(user_id, :update_highlight_2, prompt, nil, nil, prev_value, "#{feedback.rule.label.name} | #{feedback.rule.name}\n#{text}")
        end
      end
    end
  end
end
