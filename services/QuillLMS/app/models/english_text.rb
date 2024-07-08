# frozen_string_literal: true

# == Schema Information
#
# Table name: english_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class EnglishText < ApplicationRecord
  has_many :translated_texts
  has_many :translation_mappings
  has_many :gengo_jobs

  def gengo_translation?(locale: Translatable::DEFAULT_LOCALE)
    gengo_jobs.where(locale:).present?
  end

  def translated?(locale: Translatable::DEFAULT_LOCALE)
    translated_texts.where(locale:).any?
  end
end
