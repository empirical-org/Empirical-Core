# frozen_string_literal: true

class CanvasInstancesController < ApplicationController
  before_action :admin!

  def index
    render json: { canvas_integrations: canvas_integrations }
  end

  def create
    render json: canvas_objects, status: :created
  rescue ActiveRecord::NotNullViolation, ActiveRecord::RecordInvalid => e
    render json: { errors: e }, status: :unprocessable_entity
  end

  def update
    render json: updated_canvas_objects, status: :ok
  rescue ActiveRecord::NotNullViolation, ActiveRecord::RecordInvalid => e
    render json: { errors: e }, status: :unprocessable_entity
  end

  def destroy
    existing_canvas_instance.destroy
    render json: {}, status: :ok
  rescue ActiveRecord::NotNullViolation, ActiveRecord::RecordInvalid => e
    render json: { errors: e }, status: :unprocessable_entity
  end

  # No find_or_create_by since find requires searching of encrypted values
  private def canvas_config
    canvas_instance.create_canvas_config!(canvas_config_params)
  end

  private def canvas_config_params
    params
      .require(:canvas_config)
      .permit(:client_id, :client_secret)
  end

  private def canvas_instance
    @canvas_instance ||= CanvasInstance.find_or_create_by!(url: canvas_instance_params[:url].chomp('/'))
  end

  private def existing_canvas_instance
    @canvas_instance ||= CanvasInstance.find_by!(id: params[:id])
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

  private def canvas_integrations
    current_user
      .administered_school_canvas_instances_with_canvas_configs
      .map { |canvas_instance| { school_names: canvas_instance.schools.pluck(:name), id: canvas_instance.id, url: canvas_instance.url, client_id: canvas_instance.client_id, client_secret: canvas_instance.client_secret } }
  end

  private def updated_canvas_objects
    ActiveRecord::Base.transaction do
      existing_canvas_instance.update!(canvas_instance_params)
      existing_canvas_instance.canvas_config.destroy
      existing_canvas_instance.canvas_instance_schools.destroy_all

      {
        canvas_instance: existing_canvas_instance,
        canvas_config: canvas_config,
        canvas_instance_schools: canvas_instance_schools
      }
    end
  end

  private def canvas_objects
    ActiveRecord::Base.transaction do
      canvas_instance.canvas_instance_schools.destroy_all

      {
        canvas_instance: canvas_instance,
        canvas_config: canvas_config,
        canvas_instance_schools: canvas_instance_schools
      }
    end
  end

end
