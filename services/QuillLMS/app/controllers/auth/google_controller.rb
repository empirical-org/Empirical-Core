# frozen_string_literal: true

class Auth::GoogleController < ApplicationController
  before_action :set_profile, only: [:offline_access_callback, :online_access_callback]
  before_action :check_for_authorization, only: :online_access_callback
  before_action :set_user,
    :save_teacher_from_google_signup,
    :save_student_from_google_signup,
    :follow_google_redirect,
    only: [:offline_access_callback, :online_access_callback]


  # Control flow arrives at :offline_access_callback after the user authorized Quill access to their Google account via
  # a prompt. :run_background_jobs can now run since a refresh_token will exist jin the user's auth_credential.
  def offline_access_callback
    run_background_jobs
    sign_in(@user)
    redirect_to_profile_or_post_auth
  end

  # Control flow arrives at :online_access_callback when the user skips the prompt for authorization.  If the user
  # already has a valid refresh_token, the :check_for_authorization should pass and :run_background_jobs should be able
  # to run. Otherwise, the user is redirected to a prompt for authorization so that the eventual :run_background_jobs
  # will be able to run.
  def online_access_callback
    run_background_jobs
    sign_in(@user)
    redirect_to_profile_or_post_auth
  end

  private def redirect_to_profile_or_post_auth
    if session[ApplicationController::POST_AUTH_REDIRECT].present?
      redirect_to session.delete(ApplicationController::POST_AUTH_REDIRECT)
    elsif staff?
      redirect_to locker_path
    else
      redirect_to profile_path
    end
  end

  private def check_for_authorization
    user = User.find_by('google_id = ? OR email = ?', @profile.google_id&.to_s, @profile.email&.downcase)
    return if user.nil? || user.google_authorized?

    session[ApplicationController::GOOGLE_OFFLINE_ACCESS_EXPIRED] = true
    redirect_to new_session_path
  end

  private def run_background_jobs
    if @user.teacher?
      GoogleIntegration::UpdateTeacherImportedClassroomsWorker.perform_async(@user.id)
      GoogleStudentImporterWorker.perform_async(@user.id, 'Auth::GoogleController')
    elsif @user.student?
      GoogleStudentClassroomWorker.perform_async(@user.id)
    end
  end

  private def follow_google_redirect
    return unless session[GOOGLE_REDIRECT]

    redirect_route = session[GOOGLE_REDIRECT]
    session[GOOGLE_REDIRECT] = nil
    redirect_to redirect_route
  end

  private def set_profile
    @profile = GoogleIntegration::Profile.new(request, session)
  end

  private def set_user
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

    return unless @user.new_record? && session[:role].blank?

    flash[:error] = user_not_found_error_message
    flash.keep(:error)
    redirect_to(new_session_path, status: :see_other)
  end

  private def user_not_found_error_message
    <<-HTML
      <p align='left'>
        We could not find your account. Is this your first time logging in? <a href='/account/new'>Sign up</a> here if so.
        <br/>
        If you believe this is an error, please contact <strong>support@quill.org</strong> with the following info to unblock your account:
        <i>failed login of #{@profile.email} and googleID #{@profile.google_id} at #{Time.current}</i>.
      </p>
    HTML
  end

  private def save_student_from_google_signup
    return unless @user.new_record? && @user.student?
    return if @user.save

    redirect_to new_account_path
  end

  private def save_teacher_from_google_signup
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
