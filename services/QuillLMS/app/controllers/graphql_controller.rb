# frozen_string_literal: true

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
end
