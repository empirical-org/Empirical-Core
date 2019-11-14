class StudentsController < ApplicationController
  include QuillAuthentication

  before_filter :authorize!, except: [:student_demo, :join_classroom]
  before_action :redirect_to_profile, only: [:index]

  def index
    @current_user = current_user
    @js_file = 'student'
    classroom_id = params["classroom"]
    if params["joined"] == 'success' && classroom_id
      classroom = Classroom.find(classroom_id)
      flash.now["join-class-notification"] = "You have joined #{classroom.name} 🎉🎊"
    end
  end

  def account_settings
    @current_user = current_user
    @js_file = 'student'
  end

  def student_demo
    @user = User.find_by_email 'maya_angelou_demo@quill.org'
    if @user.nil?
      Demo::ReportDemoDestroyer.destroy_demo(nil)
      Demo::ReportDemoCreator.create_demo(nil)
      redirect_to "/student_demo"
    else
      sign_in @user
      redirect_to '/profile'
    end
  end

  def update_account
    response = current_user.update_student(student_params[:name], student_params[:email], student_params[:username])
    if response && response[:errors] && response[:errors].any?
      errors = response[:errors]
      render json: {errors: errors}, status: 422
    else
      render json: current_user
    end
  end

    def update_password
    # @TODO - move to the model in an update_password method that uses validations and returns the user record with errors if it's not successful.
    errors = {}
    if current_user.authenticate(params[:current_password])
      if params[:new_password] == params[:confirmed_new_password]
        current_user.update(password: params[:new_password])
      else
        errors['confirmed_new_password'] = "Those passwords didn't match. Try again."
      end
    else
      errors['current_password'] = 'Wrong password. Try again or click Forgot password to reset it.'
    end
    if errors.any?
      render json: {errors: errors}, status: 422
    else
      render json: current_user
    end
  end

  def join_classroom
    if current_user
      if current_user.role === 'student'
        classcode = params[:classcode].downcase
        begin
          classroom = Classroom.find_by(code: classcode)
          Associators::StudentsToClassrooms.run(current_user, classroom)
          JoinClassroomWorker.perform_async(current_user.id)
        rescue NoMethodError => exception
          if Classroom.unscoped.find_by(code: classcode).nil?
            InvalidClasscodeWorker.perform_async(current_user.id, params[:classcode], classcode)
            flash[:error] = "Oops! There is no class with the code #{classcode}. Ask your teacher for help."
          else
            flash[:error] = "Oops! The class with the code #{classcode} is archived. Ask your teacher for help."
          end
          flash.keep(:error)
          redirect_to '/profile'
        else
          redirect_to "/classrooms/#{classroom.id}?joined=success"
        end
      else
        flash[:error] = 'Oops! That link is only accessible for students.'
        redirect_to '/profile'
      end
    else
      session[:post_auth_redirect] = request.env['PATH_INFO']
      session[:post_sign_up_redirect] = request.env['PATH_INFO']
      redirect_to(new_session_path, status: :see_other)
    end
  end

  private

  def authorize!
    auth_failed unless current_user
  end

  def redirect_to_profile
    @current_user = current_user
    classroom_id = params["classroom"]
    if classroom_id && (Classroom.find_by(id: classroom_id).nil? || StudentsClassrooms.find_by(student_id: @current_user.id, classroom_id: classroom_id).nil?)
      flash[:error] = 'Oops! You do not belong to that classroom. Your teacher may have archived the class or removed you.'
      flash.keep(:error)
      redirect_to '/profile'
    end
  end

  def student_params
    params.permit(:name, :email, :username, :authenticity_token, student: [:name, :email, :username])
  end

end
