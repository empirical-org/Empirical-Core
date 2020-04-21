class PremiumSchoolSubscriptionEmailWorker
  include Sidekiq::Worker

  def perform(user_id)
    @user = User.find(user_id)
    school = @user.school
    admin = school&.schools_admins&.first&.try(:user)
    unless admin.nil?
      @user.send_premium_school_subscription_email(school, admin)
    else
      raise "admin is nil"
    end
  end

end
