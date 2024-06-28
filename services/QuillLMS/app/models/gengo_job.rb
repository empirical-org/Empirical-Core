# frozen_string_literal: true

# == Schema Information
#
# Table name: gengo_jobs
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer          not null
#  translated_text_id :integer
#  translation_job_id :string           not null
#
class GengoJob < ApplicationRecord
  belongs_to :translated_text
  belongs_to :english_text
  scope :pending_translation, -> { where(translated_text_id: nil) }

  def self.fetch_and_save_pending! = pending_translation.each(&:fetch_translation!)

  def fetch_translation! = Gengo::SaveTranslatedTextWorker.perform_async(translation_job_id)

  private def update_translated_text!(translation)
    translated_text.update(translation:)
  end
end
