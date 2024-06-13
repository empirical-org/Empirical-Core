# frozen_string_literal: true

module Gengo
  class SaveJobsFromOrder < ApplicationService
    class FetchTranslationOrderError < StandardError; end
    attr_accessor :order_id

    def initialize(order_id)
      @order_id = order_id
    end

    def run
      response = GengoAPI.getTranslationJobs({order_id:})
      raise FetchTranslationOrderError unless response.present?

      response["response"]&.each do |job|
        SaveTranslatedTextWorker.perform_async(job["job_id"])
      end
    end
  end
end
