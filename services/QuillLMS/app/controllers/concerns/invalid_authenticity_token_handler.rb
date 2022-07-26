# frozen_string_literal: true

module InvalidAuthenticityTokenHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActionController::InvalidAuthenticityToken do |_exception|
      flash[:error] = t('actioncontroller.errors.invalid_authenticity_token')

      respond_to do |format|
        format.html { redirect_back(fallback_location: root_path) }
        format.json { render json: { redirect: URI.parse(request.referer).path } }
      end
    end
  end
end
