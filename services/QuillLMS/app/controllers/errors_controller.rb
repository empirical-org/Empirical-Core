# frozen_string_literal: true

class ErrorsController < ApplicationController
  def error404
    render 'error_404', :status => 404
  end

  def error500
    ErrorWorker.perform_async
    render 'error_500', :status => 500
  end
end
