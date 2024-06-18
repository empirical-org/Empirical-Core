# frozen_string_literal: true

module Gengo
  class SaveTranslatedText < ApplicationService
    class FetchTranslationJobError < StandardError; end
    attr_accessor :job_id

    SLUG = "slug"
    RESPONSE = "response"
    JOB = "job"
    JOB_ID = "job_id"
    DELETED = "deleted"
    CANCELED = "canceled"
    STATUS = "status"
    BODY_TGT = "body_tgt"
    LC_TGT = "lc_tgt"

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
    private def job = response.dig(RESPONSE, JOB)
    private def active_job? = ![DELETED, CANCELED].include?(job[STATUS])
    private def new_translation = job[BODY_TGT]

    private def translated_text
      @translated_text ||= TranslatedText.find_or_create_by(
        english_text_id: job[SLUG],
        translation_job_id: job[JOB_ID],
        locale: job[LC_TGT]
      )
    end
  end
end
