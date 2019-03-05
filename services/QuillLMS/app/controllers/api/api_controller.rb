class Api::ApiController < ActionController::Base

  # this will fail because .find(id) isn't working right now, as it's uid not
  # id that's in use here...
  #
  # load_and_authorize_resource
  #
  before_filter :add_platform_doc_header

  # rescue_from ActionController::RoutingError do
  #   render json: { error_message: 'The resource you were looking for does not exist' }, status: 404
  # end
  #
  rescue_from ActiveRecord::RecordNotFound do |e|
    render json: {meta: { message: 'The resource you were looking for does not exist', status: :not_found }},
         status: 404
  end
  #
  # rescue_from CanCan::AccessDenied do
  #   render json: { error_message: 'The resource you were looking for does not exist' }, status: 404
  # end
  #

  private

  def add_platform_doc_header
    response.headers['X-Platform-Spec'] = 'https://github.com/interagent/http-api-design'
    response.headers['X-API-Reference'] = 'http://docs.empirical.org/api-reference/'
  end

  def current_user
    begin
      if session[:user_id]
        return @current_user ||= User.find(session[:user_id])
      elsif doorkeeper_token
        return User.find_by_id(doorkeeper_token.resource_owner_id) if doorkeeper_token
      else
        authenticate_with_http_basic do |username, password|
          return @current_user ||= User.find_by_token!(username) if username.present?
        end
      end
    rescue ActiveRecord::RecordNotFound
      sign_out
      nil
    end
  end

  def doorkeeper_token
    return @token if instance_variable_defined?(:@token)
    methods = Doorkeeper.configuration.access_token_methods
    @token = Doorkeeper::OAuth::Token.authenticate(request, *methods)
  end

end
