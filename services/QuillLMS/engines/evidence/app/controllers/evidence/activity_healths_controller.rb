# frozen_string_literal: true

module Evidence
  class ActivityHealthsController < ApiController

    def index
      render json: ActivityHealth.includes([:prompt_healths]).all.to_json(include: :prompt_healths)
    end
  end
end
