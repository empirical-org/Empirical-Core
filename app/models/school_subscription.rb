class SchoolSubscription < ActiveRecord::Base
  validates :school_id, :subscription_id, presence: true
  belongs_to :school
  belongs_to :subscription
  after_commit :update_schools_users
  after_create :send_premium_emails

  def update_schools_users
    if self.school && self.school.users
      self.school.users.each do |u|
        UserSubscription.create_user_sub_from_school_sub(u.id, self.subscription_id)
      end
    end
  end

  def send_premium_emails
    if self.school && self.school.users
      if Rails.env.production?
        self.school.users.each do |u|
          PremiumSchoolSubscriptionEmailWorker.perform_async(u.id)
        end
      else
        self.school.users.each do |u|
          PremiumSchoolSubscriptionEmailWorker.perform_async(u.id) if u.email.match('quill.org')
        end
      end
    end
  end

end
