# frozen_string_literal: true

module Gengo
  class SaveTranslatedText < ApplicationService
    class FetchTranslationJobError < StandardError; end
    attr_accessor :job_id

    def initialize(job_id)
      @job_id = job_id
    end

    def run
      raise FetchTranslationJobError unless response.present?

      return unless active_job?

      return if translated_text.translation == new_translation
      return unless new_translation.present?

      translated_text.update(translation: new_translation)
    end

    private def response = @response ||= GengoAPI.getTranslationJob({id: job_id})
    private def job = response.dig("response", "job")
    private def active_job? = !["deleted", "canceled"].include?(job["status"])
    private def new_translation = job["body_tgt"]

    private def translated_text
      @translated_text ||= TranslatedText.find_or_create_by(
        english_text_id: job["slug"],
        translation_job_id: job["job_id"],
        locale: job["lc_tgt"]
      )
    end
  end
end
