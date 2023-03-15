# frozen_string_literal: true

require_dependency 'evidence/application_controller'

module Evidence
  class ActivityHealthsController < ApiController

    def index
      render json: ActivityHealth.includes([:prompt_healths]).all.to_json(include: :prompt_healths)
    end
  end
end
