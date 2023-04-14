# frozen_string_literal: true

class Teachers::ProgressReportsController < ApplicationController
  layout 'progress_reports'

  around_action :force_writer_db_role, only: [:admin_demo, :coach_demo, :staff_demo, :demo]

  before_action :authorize!, except: [:demo, :admin_demo, :coach_demo, :staff_demo]
  before_action :set_vary_header, if: -> { request.xhr? || request.format == :json }

  def demo
    set_user
    self.current_user_demo_id = @user.id
    redirect_to demo_redirect_path
  end

  def staff_demo
    set_staff_user
    switch_current_user(@staff_user)
    redirect_to demo_redirect_path
  end

  def coach_demo
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
    teacher_or_staff!
  end

  private def switch_current_user(user)
    sign_out if current_user
    sign_in(user)
  end

  private def set_admin_user
    @admin_user = User.find_by(email: teacher_email) ||
      Demo::CreateAdminReport.new(teacher_email).call
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
    return if @user.present?

    recreate_demo
    set_user
  end

  private def set_staff_user
    @staff_user = User.find_by_email "hello+#{staff_demo_name}@quill.org"
    return if @staff_user.present?

    recreate_staff_demo
    set_staff_user
  end

  private def set_ap_user
    @ap_user = User.find_by_email "hello+#{demo_name}+ap@quill.org"

    return unless @ap_user.nil?

    Demo::ReportDemoAPCreator.create_demo(demo_name)
    set_ap_user
  end

  private def demo_name
    params[:name].present? ? params[:name] : "demoteacher"
  end

  private def staff_demo_name
    params[:name].present? ? params[:name] : "demoteacher+staff"
  end

  private def demo_redirect_path
    case params[:name]
    when 'demoaccount'
      teachers_progress_reports_concepts_students_path
    when 'admin_demo'
      profile_path
    else
      scorebook_teachers_classrooms_path
    end
  end

  private def recreate_demo
    Demo::ReportDemoCreator.create_demo("hello+#{demo_name}@quill.org")
  end

  private def recreate_staff_demo
    Demo::ReportDemoCreator.create_demo("hello+#{staff_demo_name}@quill.org")
  end
end
