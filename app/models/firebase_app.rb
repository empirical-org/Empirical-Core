require "firebase_token_generator"

class FirebaseApp < ActiveRecord::Base

  # TODO: What is the :uid field for?
  def token_for(user)
    payload = {:uid => "1"}

    if user.nil?
      payload[:anonymous] = true
    elsif user.admin?
      payload[:admin] = true
    elsif user.teacher?
      payload[:teacher] = true
    elsif user.student?
      payload[:student] = true
    end

    generator = Firebase::FirebaseTokenGenerator.new(secret)
    generator.create_token(payload)
  end
end