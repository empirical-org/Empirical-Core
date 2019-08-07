class Auth::GoogleController < ApplicationController
  before_action :set_profile,                     only: :google
  before_action :set_user,                        only: :google
  before_action :check_if_email_matches,          only: :google
  before_action :save_teacher_from_google_signup, only: :google
  before_action :save_student_from_google_signup, only: :google
  before_action :follow_google_redirect,          only: :google

  def google
    if @user.teacher?
      GoogleStudentImporterWorker.perform_async(@user.id, 'Auth::GoogleController')
    end

    if @user.student?
      GoogleStudentClassroomWorker.perform_async(@user.id)
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
    if session[GOOGLE_REDIRECT]
      redirect_route = session[GOOGLE_REDIRECT]
      session[GOOGLE_REDIRECT] = nil
      redirect_to redirect_route
    end
  end

  def set_profile
    @profile = GoogleIntegration::Profile.new(request, session)
  end

  def set_user
    if route_redirects_to_my_account?(session[GOOGLE_REDIRECT]) || route_redirects_to_classrooms_index?(session[GOOGLE_REDIRECT])
      user = current_user.update(email: @profile.email)
      if user
        session[ApplicationController::GOOGLE_OR_CLEVER_JUST_SET] = true
      else
        flash[:error] = "This Google account is already associated with another Quill account. Contact support@quill.org for further assistance."
        flash.keep(:error)
      end
    end
    @user = GoogleIntegration::User.new(@profile).update_or_initialize
  end

  def check_if_email_matches
    if current_user && current_user.email && current_user.email.downcase != @user.email
      redirect_to auth_google_email_mismatch_path(google_email: @user.email)
    end
  end

  def save_student_from_google_signup
    return unless @user.new_record? && @user.student?

    unless @user.save
      redirect_to new_account_path
    end
  end

  def save_teacher_from_google_signup
    return unless @user.new_record? && @user.teacher?

    @js_file = 'session'

    if @user.save
      CompleteAccountCreation.new(@user, request.remote_ip).call
      @user.subscribe_to_newsletter
      @teacherFromGoogleSignUp = true

      sign_in(@user)
      return redirect_to '/sign-up/add-k12'
    else
      @teacherFromGoogleSignUp = false
      flash.now[:error] = @user.errors.full_messages.join(', ')
    end

    render 'accounts/new'
  end
end
