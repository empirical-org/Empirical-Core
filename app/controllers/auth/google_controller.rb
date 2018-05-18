class Auth::GoogleController < ApplicationController

  after_action :set_google_id

  def google
    access_token = request.env['omniauth.auth']['credentials']['token']
    session[:google_access_token] = access_token
    name, email, google_id = GoogleIntegration::Profile.fetch_name_email_and_google_id(access_token)
    if redirect_request(request)
      # If we are here it is simply to get a new access token. Ultimately, we should
      # set this up for refresh tokens at which point, this will no longer be necessary.
      return redirect_to URI(request.referer).path
    end
    if (session[:role].present? && User.where(google_id: google_id).none?) || (current_user && !current_user.signed_up_with_google)
      # If the above is true, the user is either currently signing up and has session[:role] or
      # the user is extant and is about to register with google for the first time
      register_with_google(name, email, session[:role], access_token, google_id)
    else
      # This is only being accessed by when a user logs in with google
      google_login(email, access_token, google_id)
    end
  end

  def google_email_mismatch
    @google_email = session[:google_email] || ''
    render 'accounts/google_mismatch'
  end

  private

  def set_google_id
    if current_user
      $redis.set("user_id:#{current_user.id}_google_access_token", {token: session[:google_access_token]})
    end
  end

  def redirect_request(request)
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
      TestForEarnedCheckboxesWorker.perform_async(user.id)
      GoogleStudentImporterWorker.perform_async(current_user.id, session[:google_access_token])
      return redirect_to profile_path
    else
      return redirect_to new_account_path
    end
  end

  def new_google_user(name, email, role, access_token, google_id, user)
    @user = user
    @user.attributes = {signed_up_with_google: true, name: name, role: role, google_id: google_id}
    if @user.save
      sign_in(@user)
      ip = request.remote_ip
      AccountCreationCallbacks.new(@user, ip).trigger
      @user.subscribe_to_newsletter
      if @user.role == 'teacher'
        @js_file = 'session'
        @teacherFromGoogleSignUp = true
      end
      return true
    else
      return false
    end
  end


  def register_with_google(name, email, role, access_token, google_id)
    email = email.downcase
    if current_user && current_user.email.downcase != email
      session[:google_email] = email
      return redirect_to "/auth/google_email_mismatch/"
    else
      @user = User.find_or_initialize_by(email: email)
      if @user.new_record?
        if !new_google_user(name, email, role, access_token, google_id, @user)
          return redirect_to new_account_path
        end
        if @user.role == 'teacher'
          render 'accounts/new'
          return
        else
          GoogleIntegration::Classroom::Main.join_existing_google_classrooms(@user, access_token)
        end
      end
      if @user.errors.any?
        return redirect_to new_account_path
      else
        @user.update(signed_up_with_google: true, google_id: google_id)
        if request.referer && URI(request.referer) &&
          (URI(request.referer).path == '/teachers/classrooms/dashboard' || URI(request.referer).path == '/teachers/classrooms/new')
          # if they are hitting this route through the dashboard or new classrooms page, they should be brought to the google sync page
          return redirect_to '/teachers/classrooms/google_sync'
        end
        return redirect_to profile_path
      end
    end
  end

end
