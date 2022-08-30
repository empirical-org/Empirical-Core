# frozen_string_literal: true

class GoogleIntegration::User
  attr_reader :profile

  def initialize(profile)
    @profile = profile
  end

  def update_or_initialize
    set_user
  end

  private def set_user
    @user ||= begin
      find_user_by_google_id_or_email.tap do |user|
        new_attributes = user_params(user)
        user.new_record? ? user.assign_attributes(new_attributes) : user.update(new_attributes)
      end
    end
  end

  private def user_params(user)
    @user_params ||= begin
      params = {
        signed_up_with_google:      true,
        auth_credential_attributes: auth_credential_attributes(user),
      }

      params[:name]      = profile.name      if profile.name.present?
      params[:email]     = profile.email     if profile.email.present?
      params[:google_id] = profile.google_id if profile.google_id.present?
      params[:role]      = profile.role      if profile.role.present? && user.new_record?
      params[:clever_id] = nil

      params
    end
  end

  private def find_user_by_google_id_or_email
    ::User.where('google_id = ? OR email = ?', profile.google_id&.to_s, profile.email&.downcase).first_or_initialize
  end

  private def auth_credential_attributes(user)
    {
      provider:      'google',
      refresh_token: profile.refresh_token || user&.auth_credential&.refresh_token,
      expires_at:    profile.expires_at,
      access_token:  profile.access_token,
    }
  end
end
