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

    def log_update(user_id, prev_value)
      if semantic_rule && first_order
        rule&.prompts&.each do |prompt|
          log_change(user_id, :update_feedback_1, prompt, {url: rule.url, conjunction: prompt.conjunction}.to_json, nil, prev_value, "#{rule.label.name} | #{rule.name}\n#{text}")
        end
      elsif semantic_rule && second_order
        rule&.prompts&.each do |prompt|
          log_change(user_id, :update_feedback_2, prompt, {url: rule.url, conjunction: prompt.conjunction}.to_json, nil, prev_value, "#{rule.label.name} | #{rule.name}\n#{text}")
        end
      else
        rule.log_update(user_id, [{feedback: prev_value}], [{feedback: text}])
      end
    end
  end
end
