# frozen_string_literal: true

class CanvasInstancesController < ApplicationController
  before_action :admin!

  def create
    render json: canvas_objects, status: :created
  rescue ActiveRecord::NotNullViolation, ActiveRecord::RecordInvalid => e
    render json: { errors: e }, status: :unprocessable_entity
  end

  # No find_or_create_by since find requires searching of encrypted values
  private def canvas_config
    canvas_instance.canvas_configs.create!(canvas_config_params)
  end

  private def canvas_config_params
    params
      .require(:canvas_config)
      .permit(:client_id, :client_secret)
  end

  private def canvas_instance
    @canvas_instance ||= CanvasInstance.find_or_create_by!(canvas_instance_params)
  end

  private def canvas_instance_params
    params
      .require(:canvas_instance)
      .permit(:url)
  end

  private def canvas_instance_schools
    School
      .where(id: canvas_instance_schools_params[:school_ids])
      .map { |school| canvas_instance.canvas_instance_schools.find_or_create_by!(school: school) }
  end

  private def canvas_instance_schools_params
    params
      .require(:canvas_instance_schools)
      .permit(school_ids: [])
  end

  private def canvas_objects
    ActiveRecord::Base.transaction do
      {
        canvas_instance: canvas_instance,
        canvas_config: canvas_config,
        canvas_instance_schools: canvas_instance_schools
      }
    end
  end
end
