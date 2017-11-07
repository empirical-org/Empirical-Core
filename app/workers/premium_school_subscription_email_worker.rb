class PremiumSchoolSubscriptionEmailWorker
  include Sidekiq::Worker

  def perform(user_id)
    @user = User.find(user_id)
    school = @user.school
    admin = school.schools_admins.first.try(:user)
    @user.send_premium_school_subscription_email(school, admin)
  end

end
