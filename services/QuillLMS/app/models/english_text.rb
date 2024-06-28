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

  def has_gengo_translation?(locale: Gengo::SPANISH_LOCALE)
    gengo_jobs.where(locale:).present?
  end
end
