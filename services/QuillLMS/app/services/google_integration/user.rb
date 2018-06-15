class GoogleIntegration::User
  attr_reader :data

  def initialize(data, user_class = nil)
    @data       = data
    @user_class = ::User
  end

  def update_or_initialize
    user
  end

  private

  def user
    @user ||= begin
      @user_class.where(email: data.email).first_or_initialize.tap do |user|
        if user.new_record?
          user.assign_attributes(user_params)
        else
          user.update(user_params)
        end
      end
    end
  end

  def user_params
    @user_params ||= begin
      params = {
        signed_up_with_google:      true,
        auth_credential_attributes: auth_credential_attributes,
      }
      params[:name]      = data.name      if data.name.present?
      params[:email]     = data.email     if data.email.present?
      params[:google_id] = data.google_id if data.google_id.present?
      params[:role]      = data.role      if data.role.present?

      params
    end
  end

  def auth_credential_attributes
    {
      provider:      'google',
      refresh_token: data.refresh_token,
      expires_at:    data.expires_at,
      access_token:  data.access_token,
    }
  end
end
