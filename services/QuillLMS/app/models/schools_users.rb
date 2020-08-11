class SchoolsUsers < ActiveRecord::Base
  belongs_to :school
  belongs_to :user

  # When a teacher sets their school, we make sure they they have the appropriate subscription type.
  after_save :update_subscriptions

  def update_subscriptions
    user&.updated_school(school_id)
  end
end
