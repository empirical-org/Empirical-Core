class Teachers::ProgressReportsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'
  before_action :set_vary_header, if: -> { request.xhr? }

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end