# frozen_string_literal: true

module Evidence
  class PromptHealthsController < ApiController

    def index
      render json: PromptHealth.all.as_json
    end
  end
end
