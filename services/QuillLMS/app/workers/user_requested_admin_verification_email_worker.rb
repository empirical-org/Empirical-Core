# frozen_string_literal: true

class UserRequestedAdminVerificationEmailWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(user_id)
    user = User.find_by_id(user_id)
    UserMailer.user_requested_admin_verification_email(user).deliver_now! if user
  end
end
