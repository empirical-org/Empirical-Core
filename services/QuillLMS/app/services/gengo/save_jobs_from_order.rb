# frozen_string_literal: true

module Gengo
  class SaveJobsFromOrder < ApplicationService
    class FetchTranslationOrderError < StandardError; end
    attr_accessor :order_id

    JOB_ID = 'job_id'
    RESPONSE = 'response'

    def initialize(order_id)
      @order_id = order_id
    end

    def run
      response = GengoAPI.getTranslationJobs({order_id:})
      raise FetchTranslationOrderError unless response.present?

      response[RESPONSE]&.each do |job|
        SaveTranslatedTextWorker.perform_async(job[JOB_ID])
      end
    end
  end
end
