class SchoolSubscription < ActiveRecord::Base
  validates :school_id, :subscription_id, presence: true
  belongs_to :school
  belongs_to :subscription
  after_save :update_schools_users

  def self.update_or_create(school_id, subscription_id)
    school_sub = self.find_or_initialize_by(school_id: school_id)
    school_sub.update(subscription_id: subscription_id)
    # after commit callback is regularly failingn
    school_sub.update_schools_users
    school_sub.save!
  end

  def update_schools_users
    if self.school && self.school.users
      self.school.users.each do |u|
        UserSubscription.update_or_create(u.id, self.subscription_id)
      end
    end
  end

end
