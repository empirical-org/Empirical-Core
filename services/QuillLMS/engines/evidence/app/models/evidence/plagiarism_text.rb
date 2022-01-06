# frozen_string_literal: true

module Evidence
  class PlagiarismText < ApplicationRecord
    self.table_name = 'comprehension_plagiarism_texts'

    default_scope { order(created_at: :asc) }

    include Evidence::ChangeLog

    belongs_to :rule, inverse_of: :plagiarism_texts

    validates_presence_of :rule
    validates :text, presence: true

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :rule_id, :text]
      ))
    end

    def change_log_name
      "Plagiarism Rule Text"
    end

    def url
      rule.url
    end

    def evidence_name
      rule.name
    end

    def conjunctions
      rule.prompts.map(&:conjunction)
    end
  end
end
