class Auth::GoogleController < ApplicationController

  def google
    @access_token = request.env['omniauth.auth']['credentials']['token']
    name, email, google_id = GoogleIntegration::Profile.fetch_name_email_and_google_id(@access_token)
    if redirect_request?(request)
      # If we are here it is simply to get a new access token. Ultimately, we should
      # set this up for refresh tokens at which point, this will no longer be necessary.
       GoogleIntegration::AuthCredentials.new(request, current_user)
        .create_or_update
       redirect_to URI(request.referer).path and return
    end

    if session[:google_redirect]
      # todo: we should be using this instead of the redirect request above. Then, make an afterhook that will delete
      # the google_redirect
      GoogleIntegration::AuthCredentials.new(request, current_user)
        .create_or_update
      redirect_route = session[:google_redirect]
      session[:google_redirect] = nil
      redirect_to redirect_route and return
    end

    if (session[:role].present? && User.where(google_id: google_id).none?) || (current_user && !current_user.signed_up_with_google)
      # If the above is true, the user is either currently signing up and has session[:role] or
      # the user is extant and is about to register with google for the first time
      register_with_google(name, email, session[:role], @access_token, google_id)
    else
      # This is only being accessed by when a user logs in with google
      google_login(email, @access_token, google_id)
    end
  end

  def google_email_mismatch
    @google_email = session[:google_email] || ''
    render 'accounts/google_mismatch'
  end

  private

  def redirect_request?(request)
    request.referer &&
    URI(request.referer).path &&
    URI(request.referer).host != "accounts.google.com" &&
    ['/session/new', '/account/new', '/teachers/classrooms/dashboard', '/teachers/classrooms/new'].exclude?(URI(request.referer).path)
  end

  def google_login(email, access_token, google_id)
    user = User.find_by(email: email.downcase)
    if user.present?
      user.google_id ? nil : user.update(google_id: google_id)
      sign_in(user)
      GoogleIntegration::AuthCredentials.new(request, current_user)
        .create_or_update
      TestForEarnedCheckboxesWorker.perform_async(user.id)
      GoogleStudentImporterWorker.perform_async(current_user.id, access_token)
       redirect_to profile_path and return
    else
       redirect_to new_account_path and return
    end
  end

  def new_google_user(name, email, role, access_token, google_id, user)
    @user = user
    @user.attributes = {signed_up_with_google: true, name: name, role: role, google_id: google_id, refresh_token: @refresh_token}
    if @user.save
      sign_in(@user)
      GoogleIntegration::AuthCredentials.new(request, current_user)
        .create_or_update
      ip = request.remote_ip
      AccountCreationCallbacks.new(@user, ip).trigger
      @user.subscribe_to_newsletter
      if @user.role == 'teacher'
        @js_file = 'session'
        @teacherFromGoogleSignUp = true
      end
       true and return
    else
       false and return
    end
  end


  def register_with_google(name, email, role, access_token, google_id)
    email = email.downcase

    if current_user && current_user.email.downcase != email
      session[:google_email] = email
      redirect_to "/auth/google_email_mismatch/" and return
    end

    @user = User.find_or_initialize_by(email: email)

    if @user.new_record? && !new_google_user(name, email, role, access_token, google_id, @user)
      redirect_to new_account_path and return
    end

    if @user.new_record? && @user.role == 'teacher'
      render 'accounts/new' and return
    else
      GoogleIntegration::Classroom::Main
        .join_existing_google_classrooms(@user, access_token)
    end

    if @user.errors.any?
      redirect_to new_account_path and return
    end

    @user.update(signed_up_with_google: true, google_id: google_id)

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
