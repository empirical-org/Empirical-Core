# frozen_string_literal: true

class StudentsController < ApplicationController
  around_action :force_writer_db_role, only: [:demo_ap, :join_classroom, :student_demo]

  before_action :authorize!, except: [:student_demo, :demo_ap, :join_classroom]
  before_action :redirect_to_profile, only: [:index]

  def index
    @current_user = current_user
    @js_file = 'student'
    classroom_id = params["classroom"]
    return unless params["joined"] == 'success' && classroom_id

    classroom = Classroom.find(classroom_id)
    flash.now["join-class-notification"] = "You have joined #{classroom.name} 🎉🎊"
  end

  def account_settings
    @title = 'Settings'
    @current_user = current_user
    @js_file = 'student'
  end

  def student_demo
    @user = User.find_by_email 'angie_thomas_demo@quill.org'
    if @user.nil?
      Demo::ReportDemoDestroyer.destroy_demo(nil)
      Demo::ReportDemoCreator.create_demo(nil)
      redirect_to "/student_demo"
    else
      sign_in @user
      redirect_to classes_path
    end
  end

  def demo_ap
    @user = User.find_by_email 'bell_hooks_demo@quill.org'
    if @user.nil?
      Demo::ReportDemoAPCreator.create_demo(nil)
      redirect_to "/student_demo_ap"
    else
      sign_in @user
      redirect_to classes_path
    end
  end

  def update_account
    if current_user.update(student_params.slice(:email, :name, :username))
      render json: current_user, serializer: UserSerializer
    else
      render json: {errors: current_user.errors.messages}, status: 422
    end
  end

  def update_password
    # @TODO - move to the model in an update_password method that uses validations and returns the user record with errors if it's not successful.
    errors = {}
    if current_user.authenticate(params[:current_password])
      current_user.update(password: params[:new_password])
    else
      errors['current_password'] = 'Wrong password. Try again or click Forgot password to reset it.'
    end
    return render json: {errors: errors}, status: 422 if errors.any?

    render json: current_user, serializer: UserSerializer
  end

  def join_classroom
    if current_user
      if current_user.student?
        classcode = params[:classcode].downcase
        begin
          classroom = Classroom.find_by!(code: classcode)
          Associators::StudentsToClassrooms.run(current_user, classroom)
        rescue ActiveRecord::RecordNotFound => e
          if Classroom.unscoped.find_by(code: classcode).nil?
            flash[:error] = "Oops! There is no class with the code #{classcode}. Ask your teacher for help."
          else
            flash[:error] = "Oops! The class with the code #{classcode} is archived. Ask your teacher for help."
          end
          flash.keep(:error)
          redirect_to classes_path
        else
          redirect_to "/classrooms/#{classroom.id}?joined=success"
        end
      else
        flash[:error] = 'Oops! That link is only accessible for students.'
        redirect_to classes_path
      end
    else
      session[ApplicationController::POST_AUTH_REDIRECT] = request.env['PATH_INFO']
      session[:post_sign_up_redirect] = request.env['PATH_INFO']
      redirect_to(new_session_path, status: :see_other)
    end
  end

  private def authorize!
    auth_failed unless current_user
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def redirect_to_profile
    @current_user = current_user
    classroom_id = params["classroom"]
    unit_id = params["unit_id"]

    return redirect_to profile_path unless current_user&.student?

    if classroom_id && unit_id
      flash_missing_unit_error
    elsif classroom_id && (Classroom.find_by(id: classroom_id).nil? || StudentsClassrooms.find_by(student_id: @current_user.id, classroom_id: classroom_id).nil?)
      flash[:error] = 'Oops! You do not belong to that classroom. Your teacher may have archived the class or removed you.'
      flash.keep(:error)
      redirect_to classes_path
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def flash_missing_unit_error
    classroom_id = params["classroom"]
    unit_id = params["unit_id"]

    classroom_unit = ClassroomUnit.find_by(classroom_id: classroom_id, unit_id: unit_id)

    return if classroom_unit && classroom_unit.assigned_student_ids.include?(current_user.id)

    flash[:error] = t('activity_link.errors.activity_pack_not_assigned')
    flash.keep(:error)
    redirect_to classes_path
  end

  private def student_params
    params.permit(:name, :email, :username, :authenticity_token, student: [:name, :email, :username])
  end

end
