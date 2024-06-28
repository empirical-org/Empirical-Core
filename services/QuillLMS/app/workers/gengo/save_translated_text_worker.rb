# frozen_string_literal: true

module Gengo
  class SaveTranslatedTextWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::LOW

    def perform(job_id)
      SaveTranslatedText.run(job_id)
    end
  end
end
