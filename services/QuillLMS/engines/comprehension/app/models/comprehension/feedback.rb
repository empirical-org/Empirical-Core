module Comprehension
  class Feedback < ActiveRecord::Base
    include Comprehension::ChangeLog

    MIN_FEEDBACK_LENGTH = 10
    MAX_FEEDBACK_LENGTH = 500

    belongs_to :rule, inverse_of: :feedbacks
    has_many :highlights, inverse_of: :feedback, dependent: :destroy

    accepts_nested_attributes_for :highlights

    validates_presence_of :rule
    validates :text, presence: true, length: {minimum: MIN_FEEDBACK_LENGTH, maximum: MAX_FEEDBACK_LENGTH}
    validates :order, numericality: {only_integer: true, greater_than_or_equal_to: 0}, uniqueness: {scope: :rule_id}

    after_create :log_creation
    after_destroy :log_deletion
    after_update :log_update, if: :text_changed?
    after_update :log_first_update, if: -> {semantic_rule && first_order && text_changed?}
    after_update :log_second_update, if: -> {semantic_rule && second_order && text_changed?}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :rule_id, :text, :description, :order],
        include: [:highlights]
      ))
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

    private def log_first_update
      rule&.prompts&.each do |prompt|
        log_change(:update_feedback_1, prompt, nil, nil, change_text(0), change_text(1))
      end
    end

    private def log_second_update
      rule&.prompts&.each do |prompt|
        log_change(:update_feedback_2, prompt, nil, nil, change_text(0), change_text(1))
      end
    end

    private def change_text(change_index)
      "#{rule.label&.name} | #{rule.name}\n#{text_change[change_index]}"
    end

    private def log_creation
      rule.log_update({feedback: text})
    end

    private def log_deletion
      rule.log_update({feedback: nil}, {feedback: text})
    end

    private def log_update
      rule.log_update({feedback: text_change[1]}, {feedback: text_change[0]})
    end
  end
end
