module Comprehension
  class PlagiarismText < ActiveRecord::Base
    include Comprehension::ChangeLog

    belongs_to :rule, inverse_of: :plagiarism_text

    validates_presence_of :rule
    validates :text, presence: true

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :rule_id, :text]
      ))
    end

    def log_update(user_id, prev_value)
      rule.log_update(user_id, [{plagiarized_text: prev_value}], [{plagiarized_text: text}])
    end
  end
end
