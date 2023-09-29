# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_passages
#
#  id                       :integer          not null, primary key
#  essential_knowledge_text :string           default("")
#  highlight_prompt         :string
#  image_alt_text           :string           default("")
#  image_attribution        :text             default("")
#  image_caption            :text             default("")
#  image_link               :string
#  text                     :text
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  activity_id              :integer
#
# Indexes
#
#  index_comprehension_passages_on_activity_id  (activity_id)
#
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
