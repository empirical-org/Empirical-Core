class GraphqlController < ApplicationController

  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      # Query context goes here, for example:
      session: session,
      current_user: current_user
    }
    result = EmpiricalGrammarSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render json: result
  end

  # Handle form data, JSON body, or a blank value
  private def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  private def current_user
    begin
      if session[:user_id]
        @current_user ||= User.find(session[:user_id])
      elsif doorkeeper_token
        User.find_by_id(doorkeeper_token.resource_owner_id)
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
end
