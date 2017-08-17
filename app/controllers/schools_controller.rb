class SchoolsController < ApplicationController

  def index
    if params[:zipcode]
      @schools = School.where(zipcode: params[:zipcode])
    else
      render status: 400, json: {'error' => 'You must enter a zipcode.'}
    end
  end

end
