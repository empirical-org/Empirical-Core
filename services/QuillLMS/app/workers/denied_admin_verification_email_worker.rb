# frozen_string_literal: true

class DeniedAdminVerificationEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    user = User.find_by(id: user_id)
    school_name = School.find_by(id: school_id)&.name

    return unless user && school_name
    
    user.mailer_user.send_denied_admin_email(school_name)
  end
end
