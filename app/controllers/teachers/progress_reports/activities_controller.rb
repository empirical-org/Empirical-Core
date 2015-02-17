class Teachers::ProgressReports::ActivitiesController < ApplicationController
  before_filter :teacher!
  # before_filter :authorize! TODO: Add this back in, see other teacher controllers for details
  respond_to :html
  layout 'scorebook'

  def index

  end
end