# frozen_string_literal: true

class Api::V1::ActivityFlagsController < Api::ApiController

  def index
    render json: { activity_flags: Activity::FLAGS }
  end
end
