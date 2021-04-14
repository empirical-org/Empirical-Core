class GoogleIntegration::User
  attr_reader :data

  def initialize(data, user_class = nil)
    @data       = data
    @user_class = ::User
  end

  def update_or_initialize
    user
  end

  private def user
    @user ||= begin
      @user_class.where('google_id = ? OR email = ?', data.google_id&.to_s, data.email&.downcase).first_or_initialize.tap do |user|
        new_attributes = user_params(user)
        if user.new_record?
          user.assign_attributes(new_attributes)
        else
          user.update(new_attributes)
        end
      end
    end
  end

  private def user_params(user)
    @user_params ||= begin
      params = {
        signed_up_with_google:      true,
        post_google_classroom_assignments: user.new_record? ? true : user.post_google_classroom_assignments,
        auth_credential_attributes: auth_credential_attributes,
      }

      params[:name]      = data.name      if data.name.present?
      params[:email]     = data.email     if data.email.present?
      params[:google_id] = data.google_id if data.google_id.present?
      params[:role]      = data.role      if data.role.present? && user.new_record?
      params[:clever_id] = nil

      params
    end
  end

  private def auth_credential_attributes
    {
      provider:      'google',
      refresh_token: data.refresh_token,
      expires_at:    data.expires_at,
      access_token:  data.access_token,
    }
  end
end
