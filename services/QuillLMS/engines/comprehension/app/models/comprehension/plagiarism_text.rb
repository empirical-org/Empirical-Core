module Comprehension
  class PlagiarismText < ActiveRecord::Base
    include Comprehension::ChangeLog

    belongs_to :rule, inverse_of: :plagiarism_text
    has_many :change_logs

    after_save :log_update

    validates_presence_of :rule
    validates :text, presence: true

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :rule_id, :text]
      ))
    end

    def log_update
      if text_changed?
        log_change(nil, :update_plagiarism_text, self, {url: rule.url}.to_json, "text", text_was, text)
      end
    end
  end
end
