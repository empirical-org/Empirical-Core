module Comprehension
  class PlagiarismText < ActiveRecord::Base
    include Comprehension::ChangeLog

    belongs_to :rule, inverse_of: :plagiarism_text

    validates_presence_of :rule
    validates :text, presence: true

    # after_create :log_creation
    # after_destroy :log_deletion
    # after_update :log_update, if: :text_changed?

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :rule_id, :text]
      ))
    end

    private def log_creation
      rule.log_update({plagiarism_text: text})
    end

    private def log_deletion
      rule.log_update({plagiarism_text: nil}, {plagiarism_text: text})
    end

    private def log_update
      rule.log_update({plagiarism_text: text_change[1]}, {regex_text: text_change[0]})
    end
  end
end
