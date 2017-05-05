class SchoolSubscription < ActiveRecord::Base
  validates :school_id, :subscription_id, presence: true
  belongs_to :school
  belongs_to :subscription
  after_commit :update_schools_users

  def self.update_or_create(school_id, subscription_id)
    school_sub = self.find_or_initialize_by(school_id: school_id)
    school_sub.update(subscription_id: subscription_id)
    school_sub.save!
  end

  def update_schools_users
    if self.school && self.school.users
      self.school.users.each do |u|
        if u.user_subscription
          u.user_subscription.update(subscription_id: self.subscription_id)
        else
          UserSubscription.create(subscription_id: self.subscription_id, user_id: u.id)
        end
      end
    end
  end

end
