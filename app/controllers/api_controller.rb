class ApiController < ApplicationController

  # this will fail because .find(id) isn't working right now, as it's uid not 
  # id that's in use here...
  #
  # load_and_authorize_resource

  # rescue_from ActionController::RoutingError do
  #   render json: { error_message: 'The resource you were looking for does not exist' }, status: 404
  # end
  #
  # rescue_from ActiveRecord::RecordNotFound do |e|
  #   Raven.capture_exception(e)
  #   render json: { error_message: 'The resource you were looking for does not exist with the given ID' }, status: 404
  # end
  #
  # rescue_from CanCan::AccessDenied do
  #   render json: { error_message: 'The resource you were looking for does not exist' }, status: 404
  # end

  private

  def current_user
    User.find_by_id(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end

  def doorkeeper_token
    return @token if instance_variable_defined?(:@token)
    methods = Doorkeeper.configuration.access_token_methods
    @token = Doorkeeper::OAuth::Token.authenticate(request, *methods)
  end

end
