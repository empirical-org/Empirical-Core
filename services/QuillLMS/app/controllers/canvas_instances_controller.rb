# frozen_string_literal: true

class CanvasInstancesController < ApplicationController
  before_action :admin!

  def create
    if canvas_instance.errors.any?
      render json: canvas_instance.errors, status: :unprocessable_entity
    elsif canvas_config.errors.any?
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
    @canvas_config ||= canvas_instance.canvas_configs.create(canvas_config_params)
    # change log for canvas config creation with admin_id
  end

  private def canvas_instance_schools
    @canvas_instance_schools ||= school_ids.each do |school_id|
      canvas_instance.canvas_school_instances.find_or_create_by(school_id: school_id)
    end
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

  private def canvas_instance_schools_params
    params
      .require(:canvas_instance_schools)
      .permit(:school_ids)
  end

  private def school_ids
    canvas_instance_schools_params[:school_ids].split(',')
  end
end
