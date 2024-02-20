# frozen_string_literal: true

module BigQuery
  class MaterializedViewsController < ApplicationController
    protect_from_forgery except: :refresh
    before_action :verify_api_key

    API_KEY = ENV.fetch('BIGQUERY_INTERNAL_API_KEY', '')

    class InvalidRequestError < ::StandardError; end

    def refresh
      BigQuery::MaterializedViewRefreshWorker.perform_async(query_key)

      render json: {}, status: 200
    end

    private def verify_api_key
      return if API_KEY.present? && api_key == API_KEY

      raise InvalidRequestError
    end

    private def refresh_params = params.permit(:api_key, :query_key)
    private def api_key = refresh_params[:api_key]
    private def query_key = refresh_params[:query_key]
  end
end
