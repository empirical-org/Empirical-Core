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
  validates :source_api, presence: true, inclusion: { in: Translatable::SOURCES }
  validates :translation, presence: true
  belongs_to :english_text
  has_many :translation_mappings, through: :english_text

  scope :ordered_by_source_api, lambda { |source_api = Translatable::OPEN_AI_SOURCE|
    source_api = Translatable::OPEN_AI_SOURCE unless Translatable::SOURCES.include? source_api
    order(
      Arel.sql("CASE WHEN source_api = '#{source_api}' THEN 0 ELSE 1 END, source_api ASC")
    )
  }

  def english
    english_text&.text
  end

  def source
    translation_mappings.first&.source_type
  end
end
