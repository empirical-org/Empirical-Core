module Comprehension
  class Feedback < ActiveRecord::Base
    include Comprehension::ChangeLog

    MIN_FEEDBACK_LENGTH = 10
    MAX_FEEDBACK_LENGTH = 500

    belongs_to :rule, inverse_of: :feedbacks
    has_many :highlights, inverse_of: :feedback, dependent: :destroy
    has_many :change_logs

    accepts_nested_attributes_for :highlights

    validates_presence_of :rule
    validates :text, presence: true, length: {minimum: MIN_FEEDBACK_LENGTH, maximum: MAX_FEEDBACK_LENGTH}
    validates :order, numericality: {only_integer: true, greater_than_or_equal_to: 0}, uniqueness: {scope: :rule_id}

    after_save :log_update

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

    private def log_update
      if text_changed?
        if semantic_rule && first_order
          send_change_log(:update_feedback_1)
        elsif semantic_rule && second_order
          send_change_log(:update_feedback_2)
        elsif rule.plagiarism?
          send_change_log(:update_plagiarism_feedback)
        elsif rule.regex?
          send_change_log(:update_regex_feedback)
        end
      end
    end

    private def send_change_log(action)
      log_change(nil, action, self, {url: rule.url}.to_json, "text", text_was, text)
    end
  end
end
