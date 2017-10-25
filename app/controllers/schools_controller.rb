class SchoolsController < ApplicationController
  include CheckboxCallback

  def index
    if params[:zipcode]
      @schools = School.where(zipcode: params[:zipcode])
    else
      render status: 400, json: {'error' => 'You must enter a zipcode.'}
    end
  end

  def select_school
    # TODO: this should be in schools controller
    @js_file = 'session'
    #if the school does not specifically have a name, we send the type (e.g. not listed, international, etc..)
    if School.find_by_id(params[:school_id_or_type])
      school = School.find(params[:school_id_or_type])
    else
      school = School.find_or_create_by(name: params[:school_id_or_type])
    end
    su = SchoolsUsers.find_or_create_by(user_id: current_user.id)
    su.update!(school_id: school.id)
    find_or_create_checkbox('Add School', current_user)
    render json: {}
  end


end
