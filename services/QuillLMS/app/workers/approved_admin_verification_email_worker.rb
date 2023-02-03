# frozen_string_literal: true

class ApprovedAdminVerificationEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    user = User.find_by(id: user_id)
    school_name = School.find_by(id: school_id)&.name

    user.mailer_user.send_approved_admin_email(school_name)
  end
end
