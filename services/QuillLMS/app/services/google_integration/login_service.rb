class GoogleIntegration::LoginService

  def initialize(request, user_profile)
    @request = request
    @user_profile = user_profile
  end

  def login
    if user.present?
      user.update(google_id: google_id) unless user.google_id.present?
      GoogleIntegration::AuthCredentials.new(@request, user)
        .create_or_update
      TestForEarnedCheckboxesWorker.perform_async(user.id)
      GoogleStudentImporterWorker.perform_async(user.id, access_token)
      user
    else
      false
    end
  end

  private

  def email
    @user_profile.email
  end

  def google_id
    @user_profile.google_id
  end

  def access_token
    @request.env['omniauth.auth']['credentials']['token']
  end

  def user
    @user ||= User.find_by(email: email.downcase)
  end
end

