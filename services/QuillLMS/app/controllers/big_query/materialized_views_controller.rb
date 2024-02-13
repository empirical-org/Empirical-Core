# frozen_string_literal: true

module BigQuery
  class MaterializedViewsController < ApplicationController
    before_action :verify_api_key
    API_KEY = ENV.fetch('BIGQUERY_INTERNAL_API_KEY')

    class InvalidRequestError < ::StandardError; end

    def refresh
      MaterializedViewRefreshWorker.perform_async(query_key)
    end

    private def verify_api_key
      return if API_KEY.present? && API_KEY == api_key

      raise InvalidRequestError
    end

    private def refresh_params = params.permit(:api_key, :query_key)
    private def api_key = refresh_params[:api_key]
    private def query_key = refresh_params[:query_key]
  end
end
