# frozen_string_literal: true

# == Schema Information
#
# Table name: translated_texts
#
#  id              :bigint           not null, primary key
#  locale          :string           not null
#  source_api      :string
#  translation     :text             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#
class TranslatedText < ApplicationRecord
  GENGO_SOURCE = "gengo"
  OPEN_AI_SOURCE = "open_ai"
  belongs_to :english_text
  scope :ordered_by_source_api, ->(source_api = OPEN_AI_SOURCE) {
    order(
      Arel.sql("CASE WHEN source_api = '#{source_api}' THEN 0 ELSE 1 END, source_api ASC")
    )
  }
end
