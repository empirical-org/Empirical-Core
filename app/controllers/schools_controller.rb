class SchoolsController < ApplicationController

  def index
    if params[:zipcode]
      @schools = School.where(zipcode: params[:zipcode])
    else
      render status: 400, json: {'error' => 'You must past a zipcode.'}
    end
  end

end