require 'factory_bot_rails'

class FactoriesController < ApplicationController
  respond_to :json
  rescue_from Exception, with: :show_error

  def create
    instance = FactoryBot.create(params[:factory].to_sym, *traits, attributes)

    if instance.valid?
      render json: instance.to_json
    else
      render json: { errors: instance.errors.full_messages }, status: 422
    end
  end

  private

  def traits
    if params[:traits].present?
      params[:traits]
    else
      []
    end
  end

  def attributes
    params.except(:factory, :traits, :controller, :action)
  end

  def show_errors(exception)
    render json: { errors: exception }, status: 400
  end
end
