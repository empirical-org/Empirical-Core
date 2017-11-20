class Teachers::ClassroomsController < ApplicationController
  respond_to :json, :html, :pdf
  before_filter :teacher!
  before_filter :authorize!

  def index
    if current_user.classrooms_i_teach.empty? && current_user.archived_classrooms.empty?
      redirect_to new_teachers_classroom_path
    else
      @classrooms = current_user.classrooms_i_teach
      @classroom = @classrooms.first
    end
  end

  def new
    class_ids = current_user.classrooms_i_teach.map(&:id)
    @user = current_user
    @has_activities = ClassroomActivity.where(classroom_id: class_ids).exists?
  end

  def classrooms_i_teach
    @classrooms = current_user.classrooms_i_teach
    render json: @classrooms.order(:updated_at)
  end

  def regenerate_code
    cl = Classroom.new
    cl.generate_code
    render json: {code: cl.code}
  end

  def create
    @classroom = Classroom.create(classroom_params.merge(teacher: current_user))
    if @classroom.valid?
      render json: {classroom: @classroom, toInviteStudents: @classroom.students.empty?}
    else
       render json: {errors: @classroom.errors.full_messages }, status: 422
    end
  end

  def update
    @classroom.update_attributes(classroom_params)
    # this is updated from the students tab of the scorebook, so will make sure we keep user there
    redirect_to teachers_classroom_students_path(@classroom.id)
  end

  def destroy
    @classroom.destroy
    redirect_to teachers_classrooms_path
  end

  def hide
    classroom = Classroom.find(params[:id])
    classroom.visible = false #
    classroom.save(validate: false)
    respond_to do |format|
      format.html{redirect_to teachers_classrooms_path}
      format.json{render json: classroom}
    end
  end

  def unhide
    # can't use param[:id] here or else rails magic looks up a classroom with that id
    # kicks an active record error (because it is out of the default scope), and returns a 404
    classroom = Classroom.unscoped.find(params[:class_id])
    classroom.update(visible: true)
    render json: classroom
  end

  def units
    render json: {units: @classroom.units.select('units.id AS value, units.name').distinct.order('units.name').as_json(except: :id)}
  end

  def generate_login_pdf
    @classroom = Classroom.find(params[:id])
    if @classroom.students.empty?
      flash[:info] = 'You can print a sheet with student logins once you add students.'
      return redirect_to :back
    end
    respond_to do |format|
      format.pdf do
        pdf = LoginPdf.new(@classroom)
        # we want to sanitize the classroom name so it works as a file name
        # this will get rid of illegal characters and replace them with underscores
        filename = @classroom.name.gsub(/[^0-9A-Za-z.\-]/, '_')
        send_data pdf.render, filename: "quill_logins_for_#{filename.downcase}.pdf", type: "application/pdf"
      end
    end
  end

private

  def classroom_params
    params[:classroom].permit(:name, :code, :grade)
  end

  def authorize!
    return unless params[:id].present?
    @classroom = Classroom.find(params[:id])
    auth_failed unless @classroom.teacher == current_user
  end
end
