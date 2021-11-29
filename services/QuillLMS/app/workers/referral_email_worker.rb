# frozen_string_literal: true

class ReferralEmailWorker
  include Sidekiq::Worker

  def perform(referrals_user_id)
    ReferralsUser.find(referrals_user_id).send_activation_email
  end
end
