# frozen_string_literal: true

module Evidence
  class Passage < ApplicationRecord
    self.table_name = 'comprehension_passages'

    include Evidence::ChangeLog

    MIN_TEXT_LENGTH = 50

    belongs_to :activity, inverse_of: :passages

    validates_presence_of :activity
    validates :text, presence: true, length: {minimum: MIN_TEXT_LENGTH}

    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :text, :image_link, :image_alt_text, :image_caption, :image_attribution, :highlight_prompt, :essential_knowledge_text]
      ))
    end

    def change_log_name
      "Evidence Passage Text"
    end

    def url
      activity.url
    end
  end
end
