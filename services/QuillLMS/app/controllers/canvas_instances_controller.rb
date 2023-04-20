# frozen_string_literal: true

class CanvasInstancesController < ApplicationController
  before_action :admin!

  def create
    if canvas_instance.errors
      render json: canvas_instance.errors, status: :unprocessable_entity
    elsif canvas_config.errors
      render json: canvas_config.errors, status: :unprocessable_entity
    elsif canvas_instance_schools_errors
      render json: canvas_instance_schools.errors, status: :unprocessable_entity
    else
      render json: canvas_instance, status: :created
    end
  end

  private def canvas_instance
    @canvas_instance ||= CanvasInstance.find_or_create_by(canvas_instance_params)
  end

  private def canvas_config
    @canvas_config ||= CanvasConfig.find_or_create_by(canvas_config_params)
  end

  private def canvas_instance_schools
    @canvas_instance_schools ||= CanvasInstanceSchools.create(canvas_instance_school_params)
  end

  private def canvas_config_params
    params
      .require(:canvas_config)
      .permit(:client_id, :client_secret)
  end

  private def canvas_instance_params
    params
      .require(:canvas_instance)
      .permit(:url)
  end

  private def canvas_instance_school_params
    params
      .require(:canvas_instance_school)
      .permit(:school_ids)
  end
end
