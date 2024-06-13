# frozen_string_literal: true

module Gengo
  class SaveTranslatedText < ApplicationService
    class FetchTranslationJobError < StandardError; end
    attr_accessor :job_id

    def initialize(job_id)
      @job_id = job_id
    end

    def run
      response = GengoAPI.getTranslationJob({id: job_id})
      raise FetchTranslationJobError unless response.present?

      job = response.dig("response", "job")
      return if ["deleted", "canceled"].include? job["status"]

      TranslatedText.find_or_create_by(
        english_text_id: job["slug"],
        translation_job_id: job["job_id"],
        locale: job["lc_tgt"]
      )
    end
  end
end
