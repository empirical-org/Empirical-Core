module Comprehension
  class PlagiarismText < ActiveRecord::Base
    include Comprehension::ChangeLog

    belongs_to :rule, inverse_of: :plagiarism_text

    validates_presence_of :rule
    validates :text, presence: true

    after_save :log_update

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :rule_id, :text]
      ))
    end
  end
end
