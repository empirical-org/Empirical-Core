class Auth::GoogleController < ApplicationController
  before_action :set_profile,                     only: :google
  before_action :set_user,                        only: :google
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

    if session[ApplicationController::POST_AUTH_REDIRECT].present?
      url = session[ApplicationController::POST_AUTH_REDIRECT]
      session.delete(ApplicationController::POST_AUTH_REDIRECT)
      return redirect_to url
    end

    redirect_to profile_path
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
    if non_standard_route_redirect?(session[GOOGLE_REDIRECT])
      if current_user
        user = current_user.update(email: @profile.email)
        if user
          session[ApplicationController::GOOGLE_OR_CLEVER_JUST_SET] = true
        else
          flash[:error] = "This Google account is already associated with another Quill account. Contact support@quill.org for further assistance."
          flash.keep(:error)
        end
      else
        flash[:error] = "You are not logged in. Please try again or contact support@quill.org for further assistance."
        flash.keep(:error)
      end
    end
    @user = GoogleIntegration::User.new(@profile).update_or_initialize
    if @user.new_record? && session[:role].blank?
      flash[:error] = "The google account #{@profile.email} is not associated with any Quill accounts yet. <a href='/account/new'>Sign up</a> to create a Quill account with this Google account."
      flash.keep(:error)
      redirect_to(new_session_path, status: :see_other)
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
      @teacher_from_google_signup = true

      sign_in(@user)
      return redirect_to '/sign-up/add-k12'
    else
      @teacher_from_google_signup = false
      flash.now[:error] = @user.errors.full_messages.join(', ')
    end

    render 'accounts/new'
  end
end
