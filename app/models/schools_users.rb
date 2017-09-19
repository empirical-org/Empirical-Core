class SchoolsUsers < ActiveRecord::Base
  belongs_to :school
  belongs_to :user

  before_save :update_subscriptions

  def update_subscriptions
    self.user.updated_school(self.school_id)
  end
end
