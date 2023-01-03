# frozen_string_literal: true

require_dependency 'evidence/application_controller'

module Evidence
  class ActivityHealthsController < ApiController

    def index
      render json: ActivityHealth.all.includes(:prompt_healths).as_json
    end
  end
end
