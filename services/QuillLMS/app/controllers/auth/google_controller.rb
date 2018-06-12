class Auth::GoogleController < ApplicationController

  def google
    @access_token = request.env['omniauth.auth']['credentials']['token']
    @profile      = GoogleIntegration::Profile.new(@access_token)

    if session[:google_redirect]
      GoogleIntegration::AuthCredentials.new(request, current_user)
        .create_or_update
      redirect_route = session[:google_redirect]
      session[:google_redirect] = nil
      redirect_to redirect_route and return
    end

    if (session[:role].present? && User.where(google_id: @profile.google_id).none?) || (current_user && !current_user.signed_up_with_google)
      # If the above is true, the user is either currently signing up and has session[:role] or
      # the user is extant and is about to register with google for the first time
      register_with_google
    else
      # This is only being accessed by when a user logs in with google
      google_login
    end
  end

  def google_email_mismatch
    @google_email = session[:google_email] || ''
    render 'accounts/google_mismatch'
  end

  private

  def google_login
    logged_in_user = GoogleIntegration::LoginService.new(request, @profile).login

    if logged_in_user
      sign_in(logged_in_user)
      redirect_to profile_path and return
    else
      redirect_to new_account_path and return
    end
  end

  def new_google_user
    attributes = {
      signed_up_with_google: true,
      name: @profile.name,
      role: @profile.role,
      google_id: @profile.google_id,
      refresh_token: @refresh_token
    }

    if @user.update(attributes)
      sign_in(@user)
      GoogleIntegration::AuthCredentials.new(request, current_user)
        .create_or_update
      AccountCreationCallbacks.new(@user, request.remote_ip).trigger
      @user.subscribe_to_newsletter
      true
    else
      false
    end
  end


  def register_with_google
    email = @profile.email.downcase

    if current_user && current_user.email.downcase != email
      session[:google_email] = email
      redirect_to "/auth/google_email_mismatch/" and return
    end

    @user = User.find_or_initialize_by(email: email)

    if @user.new_record? && !new_google_user
      if @user.role == 'teacher'
        @js_file = 'session'
        @teacherFromGoogleSignUp = true
      end

      redirect_to new_account_path and return
    end

    if @user.new_record? && @user.role == 'teacher'
      render 'accounts/new' and return
    else
      GoogleIntegration::Classroom::Main
        .join_existing_google_classrooms(@user, @access_token)
    end

    if @user.errors.any?
      redirect_to new_account_path and return
    end

    @user.update(signed_up_with_google: true, google_id: @profile.google_id)

    GoogleIntegration::AuthCredentials.new(request, current_user)
      .create_or_update

    if request.referer && URI(request.referer) &&
      (URI(request.referer).path == '/teachers/classrooms/dashboard' || URI(request.referer).path == '/teachers/classrooms/new')
      # if they are hitting this route through the dashboard or new classrooms page, they should be brought to the google sync page
       redirect_to '/teachers/classrooms/google_sync' and return
    end

    redirect_to profile_path and return
  end
end
