class Teachers::ProgressReportsController < ApplicationController
  before_action :authorize!, except: [:demo, :admin_demo]
  before_action :set_vary_header, if: -> { request.xhr? || request.format == :json }
  layout 'progress_reports'

  def demo
    begin
      if params[:name] && params[:name] != ""
        @user = User.find_by_email "hello+#{params[:name]}@quill.org"
        if @user.nil?
          raise NoMethodError
        end
      else
        @user = User.find_by_email 'hello+demoteacher@quill.org'
      end
      sign_in @user
      if params[:name] == 'demoaccount'
        redirect_to teachers_progress_reports_concepts_students_path
      elsif params[:name] == 'admin_demo'
        redirect_to profile_path
      else
        redirect_to scorebook_teachers_classrooms_path
      end
    rescue NoMethodError
      Demo::ReportDemoDestroyer.destroy_demo(params[:name])
      Demo::ReportDemoCreator.create_demo(params[:name])
      if params[:name] && params[:name] != ""
        redirect_to "/demo?name=#{params[:name]}"
      else
        redirect_to "/demo"
      end
    end
  end

  def admin_demo
    name = params[:name] || 'Admin Demo School'
    email_safe_school_name = name.gsub(/^a-zA-Z\d/, '').gsub(/\s/, '').downcase
    teacher_email = "hello+demoadmin-#{email_safe_school_name}@quill.org"

    # If this demo account already exists, just go there
    existing_admin_user = User.find_by(email: teacher_email)
    if existing_admin_user.present?
      sign_out if current_user
      sign_in existing_admin_user
      return redirect_to teachers_admin_dashboard_path
    end

    # Create the demo account, return the admin teacher, and sign in
    admin_teacher = Demo::AdminReportDemoCreator.create_demo(name, email_safe_school_name, teacher_email)
    sign_out if current_user
    sign_in admin_teacher
    redirect_to teachers_admin_dashboard_path
  end

  def landing_page
    render 'landing_page'
  end

  def activities_scores_by_classroom
    render 'activities_scores_by_classroom'
  end

  def student_overview
    render 'student_overview'
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    auth_failed
  end
end
