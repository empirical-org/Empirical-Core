class Teachers::ProgressReportsController < ApplicationController
  before_action :authorize!, except: [:demo, :admin_demo, :demo_ap]
  before_action :set_vary_header, if: -> { request.xhr? || request.format == :json }
  layout 'progress_reports'

  def demo
    set_user
    switch_current_user(@user)
    redirect_to demo_redirect_path
  end

  def demo_ap
    set_ap_user
    switch_current_user(@ap_user)
    redirect_to demo_redirect_path
  end

  def admin_demo
    set_admin_user
    switch_current_user(@admin_user)
    redirect_to teachers_admin_dashboard_path
  end

  def landing_page
    render 'landing_page'
  end

  def activities_scores_by_classroom
    render 'activities_scores_by_classroom'
  end

  def real_time
    render 'real_time'
  end

  def student_overview
    render 'student_overview'
  end

  private def authorize!
    return if current_user.try(:teacher?)
    auth_failed
  end

  private def switch_current_user user
    sign_out if current_user
    sign_in user
  end

  private def set_admin_user
    @admin_user = User.find_by(email: teacher_email) ||
      Demo::CreateAdminReport.new(
        admin_demo_name,
        email_safe_school_name,
        teacher_email
      ).call
  end

  private def teacher_email
    "hello+demoadmin-#{email_safe_school_name}@quill.org"
  end

  private def email_safe_school_name
    admin_demo_name.gsub(/^a-zA-Z\d/, '').gsub(/\s/, '').downcase
  end

  private def admin_demo_name
    @name ||= params[:name] || 'Admin Demo School'
  end

  private def set_user
    @user = User.find_by_email "hello+#{demo_name}@quill.org"
    if @user.nil?
      recreate_demo
      set_user
    end
  end

  private def set_ap_user
    @ap_user = User.find_by_email "hello+#{demo_name}+ap@quill.org"
    if @ap_user.nil?
      Demo::ReportDemoAPCreator.create_demo(demo_name)
      set_ap_user
    end
  end

  private def demo_name
    params[:name].present? ? params[:name] : "demoteacher"
  end

  private def demo_redirect_path
    if params[:name] == 'demoaccount'
      teachers_progress_reports_concepts_students_path
    elsif params[:name] == 'admin_demo'
      profile_path
    else
      scorebook_teachers_classrooms_path
    end
  end

  private def recreate_demo
    Demo::ReportDemoDestroyer.destroy_demo(demo_name)
    Demo::ReportDemoCreator.create_demo(demo_name)
  end
end
