class ApiController < ApplicationController
  before_action :find_object, only: [:show, :update, :destroy]
  skip_before_filter :verify_authenticity_token

  def show
    singleton_response
  end

  def update
    old_val = params.class.action_on_unpermitted_parameters
    params.class.action_on_unpermitted_parameters = false
    @object.attributes = params.permit({'data' => params['data'].keys})
    params.class.action_on_unpermitted_parameters = old_val

    if @object.save
      singleton_response
    else
      render json: {
        error: @object.errors
      }
    end
  end

  rescue_from(ActionController::RoutingError) do
    render json: { error_message: "The resource you were looking for does not exist" }, status: 404
  end

  def find_object
    @object = ActivityClassification.find_by_uid!(params[:cid]).activities.find_by_uid!(params[:id])
  end

  def singleton_response
    render json: {
      object: @object.as_json(root: false, only: [], methods: ['id', 'uid', 'data'])
    }
  end

  # rescue_from(Exception) do |e|
  #   binding.pry
  #   render json: { error_message: "We're sorry, but something went wrong. We've been notified about this issue and we'll take a look at it shortly." }, status: 500
  # end
end
