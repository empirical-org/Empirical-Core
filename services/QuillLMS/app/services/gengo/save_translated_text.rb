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
      return if gengo_job.translated_text.present?
      raise FetchTranslationJobError unless response.present?
      return unless new_translation

      gengo_job.update(translated_text:)
    end

    private def response = @response ||= GengoAPI.getTranslationJob({id: job_id})
    private def job = response&.dig(RESPONSE, JOB)
    private def active_job? = ![DELETED, CANCELED].include?(job[STATUS])
    private def new_translation = job[BODY_TGT]
    private def locale = job[LC_TGT]

    private def gengo_job
      # Not using find_or_create_by because the find_by doesn't make an external API request
      @gengo_job ||= GengoJob.find_by(translation_job_id: job_id) || create_gengo_job
    end
    private def translated_text
      TranslatedText.create(
        english_text_id: gengo_job.english_text_id,
        locale:,
        translation: new_translation,
        source_api: TranslatedText::GENGO_SOURCE
      )
    end

    private def create_gengo_job
      GengoJob.create(
        english_text_id: job[SLUG],
        translation_job_id: job[JOB_ID],
        locale:
      )
    end

  end
end
