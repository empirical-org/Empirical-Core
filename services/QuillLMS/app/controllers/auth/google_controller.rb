class Auth::GoogleController < ApplicationController
  before_action :follow_google_redirect,       only: :google
  before_action :set_profile,                  only: :google
  before_action :set_user,                     only: :google
  before_action :check_if_email_matches,       only: :google
  before_action :handle_google_teacher_signup, only: :google
  before_action :handle_google_student_signup, only: :google

  def google
    if @user.teacher?
      GoogleStudentImporterWorker.perform_async(@user.id)
    end
    if @user.student?
      GoogleIntegration::Classroom::Main.join_existing_google_classrooms(@user)
    end

    sign_in(@user)
    redirect_to profile_path
  end

  def google_email_mismatch
    @google_email = params[:google_email] || ''
    render 'accounts/google_mismatch'
  end

  private

  def follow_google_redirect
    if session[:google_redirect]
      redirect_route = session[:google_redirect]
      session[:google_redirect] = nil
      redirect_to redirect_route
    end
  end

  def set_profile
    @profile = GoogleIntegration::Profile.new(request, session)
  end

  def set_user
    @user = GoogleIntegration::User.new(@profile).update_or_initialize
  end

  def check_if_email_matches
    if current_user && current_user.email.downcase != @user.email
      redirect_to auth_google_email_mismatch_path(google_email: @user.email)
    end
  end

  def handle_google_student_signup
    unless @user.new_record? && @user.student? && @user.save
      render 'accounts/new'
    end
  end

  def handle_google_teacher_signup
    return unless @user.new_record? && @user.teacher?

    if @user.save
      AccountCreationCallbacks.new(@user, request.remote_ip).trigger
      @user.subscribe_to_newsletter
      @teacherFromGoogleSignUp = true
      @js_file = 'session'

      sign_in(@user)
    end

    render 'accounts/new'
  end
end
