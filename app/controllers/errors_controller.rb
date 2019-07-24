class ErrorsController < ApplicationController
  def error_404
    render 'error_404', :status => 404
    return
  end

  def error_500
    ErrorWorker.perform_async
    render 'error_500', :status => 500
    return
  end
end
