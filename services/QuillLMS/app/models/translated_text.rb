# == Schema Information
#
# Table name: translated_texts
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  translation        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer
#  translation_job_id :string           not null
#
class TranslatedText < ApplicationRecord
  belongs_to :english_text
  scope :pending_translation, -> { where(translation: nil) }

  def self.fetch_pending!
    pending_translation.each(&:fetch_translation!)
  end

  def fetch_translation!
    return unless translation.nil?

    response = GengoAPI.getTranslationJob({id: translation_job_id})
    return unless response

    update_attribute(:translation, response.dig("response", "job", "body_tgt"))
  end
end
