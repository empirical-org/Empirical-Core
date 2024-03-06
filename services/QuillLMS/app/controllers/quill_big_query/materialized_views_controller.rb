# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewsController < ApplicationController
    protect_from_forgery except: :refresh
    before_action :verify_api_key

    API_KEY = ENV.fetch('BIGQUERY_INTERNAL_API_KEY', '')

    class InvalidRequestError < ::StandardError; end

    def refresh
      QuillBigQuery::MaterializedViewRefreshWorker.perform_async(view_key)

      render json: {}, status: 200
    end

    private def verify_api_key
      return if API_KEY.present? && api_key == API_KEY

      raise InvalidRequestError
    end

    private def refresh_params = params.permit(:api_key, :view_key)
    private def api_key = refresh_params[:api_key]
    private def view_key = refresh_params[:view_key]
  end
end
