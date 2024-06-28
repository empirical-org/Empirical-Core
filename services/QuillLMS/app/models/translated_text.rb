# frozen_string_literal: true

# == Schema Information
#
# Table name: translated_texts
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  translation        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer          not null
#  translation_job_id :string           not null
#
class TranslatedText < ApplicationRecord
  belongs_to :english_text
  scope :pending_translation, -> { where(translation: nil) }

  def self.fetch_and_save_pending! = pending_translation.each(&:fetch_translation!)

  def fetch_translation! = Gengo::SaveTranslatedText.run(translation_job_id)
end
