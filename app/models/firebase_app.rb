require 'firebase_token_generator'

class FirebaseApp < ActiveRecord::Base

  def token_for(user)
    payload = create_payload(user)
    token_generator.create_token(payload)
  end

  private

  def create_payload(user)
    user_id = user.present? ? user.id.to_s : 'anonymous'
    payload = {uid: "custom:#{user_id}"}

    if user.nil?
      payload[:anonymous] = true
    elsif user.staff?
      payload[:staff] = true
    elsif user.admin?
      payload[:admin] = true
    elsif user.teacher?
      payload[:teacher] = true
    elsif user.student?
      payload[:student] = true
    end
    payload
  end

  def token_generator
    @generator ||= Firebase::FirebaseTokenGenerator.new(secret)
  end
end
