# frozen_string_literal: true

class PremiumSchoolSubscriptionEmailWorker
  include Sidekiq::Worker

  def perform(user_id)
    @user = User.find_by_id(user_id)
    return unless @user

    school = @user.school
    admin = school&.schools_admins&.first&.try(:user)
    @user.send_premium_school_subscription_email(school, admin)
  end

end
