# frozen_string_literal: true

# == Schema Information
#
# Table name: translation_mappings
#
#  id              :bigint           not null, primary key
#  source_type     :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#  source_id       :integer          not null
#
class TranslationMapping < ApplicationRecord
  belongs_to :english_text
  belongs_to :source, polymorphic: true
  has_many :translated_texts, through: :english_text
  delegate :text, to: :english_text
  scope :translated, lambda { |locale|
    joins(english_text: :translated_texts)
      .where(translated_texts: { locale:})
      .distinct
  }

  def translation(locale: Translatable::DEFAULT_LOCALE, source_api: Translatable::OPEN_AI_SOURCE)
    translated_texts.where(locale:).ordered_by_source_api(source_api).first&.translation || ""
  end
end
