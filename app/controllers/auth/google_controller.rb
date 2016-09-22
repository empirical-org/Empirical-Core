class Auth::GoogleController < ApplicationController

  def google
    access_token = request.env['omniauth.auth']['credentials']['token']
    name, email = GoogleIntegration::Profile.fetch_name_and_email(access_token)
    if session[:role].present?
      google_sign_up(name, email, session[:role], access_token)
    else
      google_login(email, access_token)
    end
  end


  private

  def google_login(email, access_token)
    user = User.find_by(email: email.downcase)
    if user.present?
      sign_in(user)
      GoogleIntegration::Classroom::Main.pull_and_save_data(user, access_token)
      redirect_to profile_path
    else
      redirect_to new_account_path
    end
  end


  def google_sign_up(name, email, role, access_token)
    user = User.find_or_initialize_by(email: email.downcase)
    if user.new_record?
      user.attributes = {signed_up_with_google: true, name: name, role: role}
      user.save
    end

    if user.errors.any?
      redirect_to new_account_path
    else
      sign_in(user)
      ip = request.remote_ip
      GoogleIntegration::Classroom::Main.pull_and_save_data(user, access_token)
      AccountCreationCallbacks.new(user, ip).trigger
      user.subscribe_to_newsletter
      if user.role == 'teacher'
        @teacherFromGoogleSignUp = true
        render 'accounts/new'
      else
        redirect_to profile_path
      end
    end
  end
end
