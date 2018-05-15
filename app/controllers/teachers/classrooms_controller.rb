class Teachers::ClassroomsController < ApplicationController
  respond_to :json, :html, :pdf
  before_filter :teacher!
  # The excepted/only methods below are ones that should be accessible to coteachers.
  # TODO This authing could probably be refactored.
  before_filter :authorize_owner!, except: [:scores, :units, :scorebook, :generate_login_pdf]
  before_filter :authorize_teacher!, only: [:scores, :units, :scorebook, :generate_login_pdf]

  def index
    if current_user.classrooms_i_teach.empty? && current_user.archived_classrooms.empty? && !current_user.has_outstanding_coteacher_invitation?
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
    render json: @classrooms.sort_by { |c| c[:update_at] }
  end

  def regenerate_code
    render json: {code: Classroom.generate_unique_code}
  end

  def create
    @classroom = Classroom.create_with_join(classroom_params, current_user.id)
    if @classroom.valid?
      # For onboarding purposes, we don't want to prompt a teacher to invite students before they've assigned any units.
      should_redirect_to_invite_students = @classroom.students.empty? && current_user.units.any?
      render json: {classroom: @classroom, toInviteStudents: should_redirect_to_invite_students}
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
    @classroom = Classroom.find(params[:id])
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

  def transfer_ownership
    requested_new_owner_id = params[:requested_new_owner_id]
    owner_role = ClassroomsTeacher::ROLE_TYPES[:owner]
    coteacher_role = ClassroomsTeacher::ROLE_TYPES[:coteacher]

    begin
      ActiveRecord::Base.transaction do
        ClassroomsTeacher.find_by(user_id: current_user.id, classroom_id: @classroom.id, role: owner_role).update(role: coteacher_role)
        ClassroomsTeacher.find_by(user_id: requested_new_owner_id, classroom_id: @classroom.id, role: coteacher_role).update(role: owner_role)
      end
      CoteacherAnalytics.new.track_transfer_classroom(current_user, requested_new_owner_id)
    rescue
      return render json: { error: 'Please ensure this teacher is a co-teacher before transferring ownership.' }, status: 401
    end

    return render json: {}
  end

private

  def classroom_params
    params[:classroom].permit(:name, :code, :grade)
  end

  def authorize_owner!
    return unless params[:id].present?
    @classroom = Classroom.find(params[:id])
    classroom_owner!(@classroom.id)
  end

  def authorize_teacher!
    return unless params[:id].present?
    classroom_teacher!(params[:id])
  end
end
