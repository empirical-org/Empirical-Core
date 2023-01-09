# frozen_string_literal: true

require_dependency 'evidence/application_controller'

module Evidence
  class PromptHealthsController < ApiController

    def index
      render json: PromptHealth.all.as_json
    end
  end
end
