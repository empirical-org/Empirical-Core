class ApplicationController < ActionController::API

  def routing_error
    render head: :not_found, body: nil, status: 404
  end
end
