class SchoolsUsers < ActiveRecord::Base
  belongs_to :school
  belongs_to :user

  # When a teacher sets their school, we make sure they they have the appropriate subscription type.
  before_save :update_subscriptions

  def update_subscriptions
    self.user.updated_school(self.school_id)
  end
end
